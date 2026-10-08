import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { OrderService } from '../../../core/services/order.service';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { ProductService } from '../../../core/services/product.service';
import { Farmacia } from '../../../core/models/pharmacy.model';
import { Producto } from '../../../core/models/product.model';

interface LineaEditable {
    productoId: number | null;
    cantidad: number;
    descuentoPct: number;
}

@Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, SelectModule, MessageModule, RouterLink],
    templateUrl: './order-form.html',
    styleUrl: './order-form.scss'
})
export class OrderForm implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private orderService = inject(OrderService);
    private pharmacyService = inject(PharmacyService);
    private productService = inject(ProductService);

    farmacias = signal<Farmacia[]>([]);
    productos = signal<Producto[]>([]);

    farmaciaId: number | null = null;
    farmaciaNombre = '';

    lineas = signal<LineaEditable[]>([this.lineaVacia()]);

    pedidoId: number | null = null;
    modoEdicion = signal(false);

    cargando = signal(true);
    guardando = signal(false);
    error = signal<string | null>(null);

    total = computed(() =>
        this.lineas().reduce((acc, linea) => {
            const producto = this.productos().find((p) => p.id === linea.productoId);

            if (!producto || !linea.cantidad) {
                return acc;
            }

            const subtotal = producto.precioLista * linea.cantidad * (1 - (linea.descuentoPct || 0) / 100);

            return acc + Math.round(subtotal * 100) / 100;
        }, 0)
    );

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');

        forkJoin({
            farmacias: this.pharmacyService.listar(),
            productos: this.productService.listarActivos()
        }).subscribe(({ farmacias, productos }) => {
            this.farmacias.set(farmacias);
            this.productos.set(productos);

            if (idParam) {
                this.cargarParaEditar(Number(idParam));
            } else {
                this.cargando.set(false);
            }
        });
    }

    private cargarParaEditar(id: number): void {
        this.pedidoId = id;
        this.modoEdicion.set(true);

        this.orderService.obtener(id).subscribe({
            next: (pedido) => {
                if (pedido.estado !== 'PENDIENTE') {
                    this.error.set('Solo se pueden editar pedidos en estado PENDIENTE');
                    this.cargando.set(false);
                    return;
                }

                this.farmaciaId = pedido.farmaciaId;
                this.farmaciaNombre = pedido.farmaciaNombre;

                this.lineas.set(
                    pedido.lineas.map((linea) => ({
                        productoId: this.productos().find((p) => p.codigo === linea.productoCodigo)?.id ?? null,
                        cantidad: linea.cantidad,
                        descuentoPct: linea.descuentoPct
                    }))
                );

                this.cargando.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudo cargar el pedido');
                this.cargando.set(false);
            }
        });
    }

    private lineaVacia(): LineaEditable {
        return {
            productoId: null,
            cantidad: 1,
            descuentoPct: 0
        };
    }

    agregarLinea(): void {
        this.lineas.update((lineas) => [...lineas, this.lineaVacia()]);
    }

    quitarLinea(index: number): void {
        this.lineas.update((lineas) => lineas.filter((_, i) => i !== index));
    }

    precioDe(productoId: number | null): number {
        return this.productos().find((producto) => producto.id === productoId)?.precioLista ?? 0;
    }

    guardar(): void {
        this.error.set(null);

        if (!this.modoEdicion() && !this.farmaciaId) {
            this.error.set('Selecciona una farmacia');
            return;
        }

        const lineasValidas = this.lineas().filter((linea) => linea.productoId && linea.cantidad > 0);

        if (lineasValidas.length === 0) {
            this.error.set('Agrega al menos una línea con producto y cantidad');
            return;
        }

        const lineasRequest = lineasValidas.map((linea) => ({
            productoId: linea.productoId!,
            cantidad: linea.cantidad,
            descuentoPct: linea.descuentoPct || 0
        }));

        this.guardando.set(true);

        const obs = this.modoEdicion() ? this.orderService.editar(this.pedidoId!, { lineas: lineasRequest }) : this.orderService.crear({ farmaciaId: this.farmaciaId!, lineas: lineasRequest });

        obs.subscribe({
            next: (pedido) => {
                this.guardando.set(false);
                this.router.navigate(['/orders', pedido.id]);
            },
            error: (err) => {
                this.guardando.set(false);
                this.error.set(err?.error?.message ?? 'No se pudo guardar el pedido');
            }
        });
    }
}
