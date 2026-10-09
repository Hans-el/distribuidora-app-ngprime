import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { Farmacia, FarmaciaInactiva } from '../../../core/models/pharmacy.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableLazyLoadEvent } from 'primeng/table';

type Vista = 'todas' | 'inactivas';

@Component({
    selector: 'app-pharmacy-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule, TooltipModule, FormsModule, InputTextModule],
    templateUrl: './pharmacy-list.html'
})
export class PharmacyList {
    private pharmacyService = inject(PharmacyService);
    auth = inject(AuthService);

    vista = signal<Vista>('todas');

    farmacias = signal<Farmacia[]>([]);
    loading = signal(false);

    search = '';
    page = 0;
    size = 10;
    totalRecords = 0;

    farmaciasInactivas = signal<FarmaciaInactiva[]>([]);
    loadingInactivas = signal(false);

    yaCargoInactivas = false;
    diasInactivas = 60;

    ngOnInit(): void {}

    cargarFarmacias(): void {
        this.loading.set(true);
        this.pharmacyService.listarPaginado(this.search.trim(), this.page, this.size).subscribe({
            next: (res) => {
                this.farmacias.set(res.content);
                this.totalRecords = res.totalElements;
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    buscar(): void {
        this.page = 0;
        this.cargarFarmacias();
    }

    onPageChange(event: TableLazyLoadEvent): void {
        this.size = event.rows ?? this.size;
        this.page = Math.floor((event.first ?? 0) / this.size);
        this.cargarFarmacias();
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
