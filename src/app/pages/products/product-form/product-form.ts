import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';

import { LaboratoryService } from '../../../core/services/laboratory.service';
import { ProductService } from '../../../core/services/product.service';
import { Laboratorio, Producto, ProductoRequest } from '../../../core/models/product.model';

interface FormState {
    id: number | null;
    codigo: string;
    nombre: string;
    laboratorioId: number | null;
    precioLista: number | null;
}

const LAB_NUEVO = -1;

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputNumberModule, InputTextModule, MessageModule, SelectModule],
    templateUrl: './product-form.html',
    styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
    private productService = inject(ProductService);
    private laboratoryService = inject(LaboratoryService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    readonly LAB_NUEVO = LAB_NUEVO;

    laboratorios = signal<Laboratorio[]>([]);

    loading = signal(false);
    guardando = signal(false);

    error = signal<string | null>(null);

    form: FormState = this.formVacio();

    get esEdicion(): boolean {
        return this.form.id !== null;
    }

    ngOnInit(): void {
        this.cargarLaboratorios();

        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.cargarProducto(Number(id));
        }
    }

    private cargarLaboratorios(): void {
        this.laboratoryService.listar().subscribe({
            next: (laboratorios) => {
                this.laboratorios.set(laboratorios);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudieron cargar los laboratorios');
            }
        });
    }

    private cargarProducto(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.productService.obtener(id).subscribe({
            next: (producto) => {
                this.cargarFormulario(producto);
                this.loading.set(false);
            },

            error: (err) => {
                this.loading.set(false);

                this.error.set(err?.error?.message ?? 'No se pudo cargar el producto');
            }
        });
    }

    private cargarFormulario(producto: Producto): void {
        const laboratorio = this.laboratorios().find((l) => l.nombre === producto.laboratorio);

        this.form = {
            id: producto.id,
            codigo: producto.codigo,
            nombre: producto.nombre,
            laboratorioId: laboratorio?.id ?? null,
            precioLista: producto.precioLista
        };
    }

    private formVacio(): FormState {
        return {
            id: null,
            codigo: '',
            nombre: '',
            laboratorioId: null,
            precioLista: null
        };
    }

    guardar(): void {
        this.error.set(null);

        if (!this.form.codigo.trim() || !this.form.nombre.trim() || this.form.precioLista === null) {
            this.error.set('Completa código, nombre y precio');
            return;
        }

        if (this.form.laboratorioId === null) {
            this.error.set('Selecciona o crea un laboratorio');
            return;
        }

        if (this.form.laboratorioId === LAB_NUEVO && !this.nombreLabNuevo.trim()) {
            this.error.set('Escribe el nombre del nuevo laboratorio');
            return;
        }

        this.guardando.set(true);

        if (this.form.laboratorioId === LAB_NUEVO) {
            this.crearLaboratorioYGuardar();
            return;
        }

        this.guardarProducto();
    }

    nombreLabNuevo = '';

    private crearLaboratorioYGuardar(): void {
        this.laboratoryService.crear(this.nombreLabNuevo.trim()).subscribe({
            next: (laboratorio) => {
                this.laboratorios.update((laboratorios) => [...laboratorios, laboratorio]);

                this.form.laboratorioId = laboratorio.id;

                this.guardarProducto();
            },

            error: (err) => {
                this.guardando.set(false);

                this.error.set(err?.error?.message ?? 'No se pudo crear el laboratorio');
            }
        });
    }

    private guardarProducto(): void {
        const request: ProductoRequest = {
            codigo: this.form.codigo.trim(),
            nombre: this.form.nombre.trim(),
            laboratorioId: this.form.laboratorioId!,
            precioLista: this.form.precioLista!
        };

        const request$ = this.form.id ? this.productService.editar(this.form.id, request) : this.productService.crear(request);

        request$.subscribe({
            next: () => {
                this.guardando.set(false);

                this.router.navigate(['/products']);
            },

            error: (err) => {
                this.guardando.set(false);

                this.error.set(err?.error?.message ?? 'No se pudo guardar el producto');
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/products']);
    }
}
