import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
    private orderService = inject(OrderService);
    private pharmacyService = inject(PharmacyService);
    private productService = inject(ProductService);
    private router = inject(Router);

    farmacias = signal<Farmacia[]>([]);
    productos = signal<Producto[]>([]);

    farmaciaId: number | null = null;

    lineas = signal<LineaEditable[]>([this.lineaVacia()]);

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
        this.pharmacyService.listar().subscribe((farmacias) => {
            this.farmacias.set(farmacias);
        });

        this.productService.listarActivos().subscribe((productos) => {
            this.productos.set(productos);
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

        if (!this.farmaciaId) {
            this.error.set('Selecciona una farmacia');
            return;
        }

        const lineasValidas = this.lineas().filter((linea) => linea.productoId && linea.cantidad > 0);

        if (lineasValidas.length === 0) {
            this.error.set('Agrega al menos una línea con producto y cantidad');
            return;
        }

        this.guardando.set(true);

        this.orderService
            .crear({
                farmaciaId: this.farmaciaId,
                lineas: lineasValidas.map((linea) => ({
                    productoId: linea.productoId!,
                    cantidad: linea.cantidad,
                    descuentoPct: linea.descuentoPct || 0
                }))
            })
            .subscribe({
                next: (pedido) => {
                    this.guardando.set(false);

                    this.router.navigate(['/orders', pedido.id]);
                },

                error: (err) => {
                    this.guardando.set(false);

                    this.error.set(err?.error?.message ?? 'No se pudo registrar el pedido');
                }
            });
    }
}
