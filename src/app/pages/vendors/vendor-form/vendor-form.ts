import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { VendorService } from '../../../core/services/vendor.service';

@Component({
    selector: 'app-vendor-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, MessageModule],
    templateUrl: './vendor-form.html'
})
export class VendorForm implements OnInit {
    private vendorService = inject(VendorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    vendedorId: number | null = null;
    nombre = '';

    loading = signal(false);
    guardando = signal(false);
    error = signal<string | null>(null);

    get esEdicion(): boolean {
        return this.vendedorId !== null;
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.cargarVendedor(Number(id));
        }
    }

    // No existe GET /vendors/{id}: se pide la lista completa y se busca por id,
    // igual que hace pharmacy-form con las farmacias.
    private cargarVendedor(id: number): void {
        this.loading.set(true);

        this.vendorService.listar(false).subscribe({
            next: (vendedores) => {
                const vendedor = vendedores.find((v) => v.id === id);

                if (!vendedor) {
                    this.error.set('Vendedor no encontrado');
                } else {
                    this.vendedorId = vendedor.id;
                    this.nombre = vendedor.nombre;
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudo cargar el vendedor');
                this.loading.set(false);
            }
        });
    }

    guardar(): void {
        this.error.set(null);

        if (!this.nombre.trim()) {
            this.error.set('El nombre es obligatorio');
            return;
        }

        this.guardando.set(true);

        const request = { nombre: this.nombre.trim() };
        const obs = this.vendedorId ? this.vendorService.editar(this.vendedorId, request) : this.vendorService.crear(request);

        obs.subscribe({
            next: () => {
                this.guardando.set(false);
                this.router.navigate(['/vendors']);
            },
            error: (err) => {
                this.guardando.set(false);
                this.error.set(err?.error?.message ?? 'No se pudo guardar el vendedor');
            }
        });
    }
}
