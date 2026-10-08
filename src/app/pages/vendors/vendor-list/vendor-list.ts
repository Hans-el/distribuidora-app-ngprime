import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { VendorService } from '../../../core/services/vendor.service';
import { Vendedor } from '../../../core/models/pharmacy.model';

@Component({
    selector: 'app-vendor-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, MessageModule, TableModule, TagModule, TooltipModule],
    templateUrl: './vendor-list.html'
})
export class VendorList implements OnInit {
    private vendorService = inject(VendorService);

    vendedores = signal<Vendedor[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.cargar();
    }

    cargar(): void {
        this.loading.set(true);

        // false = incluye inactivos, para poder reactivarlos desde aquí
        this.vendorService.listar(false).subscribe({
            next: (vendedores) => {
                this.vendedores.set(vendedores);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudieron cargar los vendedores');
                this.loading.set(false);
            }
        });
    }

    toggleActivo(vendedor: Vendedor): void {
        this.error.set(null);

        this.vendorService.cambiarActivo(vendedor.id, !vendedor.activo).subscribe({
            next: () => this.cargar(),
            // Aquí llega el 422 si intentas desactivar a alguien con farmacias asignadas
            error: (err) => this.error.set(err?.error?.message ?? 'No se pudo cambiar el estado')
        });
    }
}
