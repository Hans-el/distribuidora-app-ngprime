import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { Farmacia, FarmaciaInactiva } from '../../../core/models/pharmacy.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { VendorService } from '../../../core/services/vendor.service';

type Vista = 'todas' | 'inactivas';

@Component({
    selector: 'app-pharmacy-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule, TooltipModule],
    templateUrl: './pharmacy-list.html'
})
export class PharmacyList implements OnInit {
    private pharmacyService = inject(PharmacyService);
    private vendorService = inject(VendorService);
    auth = inject(AuthService);

    vista = signal<Vista>('todas');

    farmacias = signal<Farmacia[]>([]);
    loading = signal(true);

    farmaciasInactivas = signal<FarmaciaInactiva[]>([]);
    loadingInactivas = signal(false);

    yaCargoInactivas = false;
    diasInactivas = 60;

    ngOnInit(): void {
        this.cargarFarmacias();
    }

    private cargarFarmacias(): void {
        this.loading.set(true);

        this.pharmacyService.listar().subscribe({
            next: (data) => {
                this.farmacias.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    cambiarVista(vista: Vista): void {
        this.vista.set(vista);

        if (vista === 'inactivas' && !this.yaCargoInactivas) {
            this.cargarInactivas();
        }
    }

    cargarInactivas(): void {
        this.loadingInactivas.set(true);

        this.pharmacyService.inactivas(this.diasInactivas).subscribe({
            next: (data) => {
                this.farmaciasInactivas.set(data);
                this.loadingInactivas.set(false);
                this.yaCargoInactivas = true;
            },
            error: () => {
                this.loadingInactivas.set(false);
            }
        });
    }
}
