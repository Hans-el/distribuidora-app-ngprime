import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { OrderService } from '../../../core/services/order.service';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { Pedido, EstadoPedido } from '../../../core/models/order.model';
import { Farmacia } from '../../../core/models/pharmacy.model';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, DatePickerModule, SelectModule, TableModule, TagModule],
    templateUrl: './order-list.html',
    styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
    private orderService = inject(OrderService);
    private pharmacyService = inject(PharmacyService);

    pedidos = signal<Pedido[]>([]);
    farmacias = signal<Farmacia[]>([]);
    loading = signal(true);

    filtroFarmaciaId: number | null = null;
    filtroEstado: EstadoPedido | '' = '';
    filtroFrom: Date | null = null;
    filtroTo: Date | null = null;

    // Paginación
    page = 0;
    size = 10;
    totalRecords = 0;

    estados = [
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Entregado', value: 'ENTREGADO' },
        { label: 'Anulado', value: 'ANULADO' }
    ];

    ngOnInit(): void {
        this.pharmacyService.listar().subscribe((f) => {
            this.farmacias.set(f);
        });

        this.buscar();
    }

    buscar(): void {
        // Cada nueva búsqueda empieza desde la primera página
        this.page = 0;

        this.cargarPedidos();
    }

    private cargarPedidos(): void {
        this.loading.set(true);

        this.orderService
            .listarPaginado(
                {
                    farmaciaId: this.filtroFarmaciaId ?? undefined,
                    estado: this.filtroEstado || undefined,
                    from: this.formatearFecha(this.filtroFrom),
                    to: this.formatearFecha(this.filtroTo)
                },
                this.page,
                this.size
            )
            .subscribe({
                next: (response) => {
                    this.pedidos.set(response.content);
                    this.totalRecords = response.totalElements;
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                }
            });
    }

    onPageChange(event: TableLazyLoadEvent): void {
        this.page = Math.floor((event.first ?? 0) / (event.rows ?? this.size));

        this.size = event.rows ?? this.size;

        this.cargarPedidos();
    }

    limpiar(): void {
        this.filtroFarmaciaId = null;
        this.filtroEstado = '';
        this.filtroFrom = null;
        this.filtroTo = null;

        this.buscar();
    }

    severidadEstado(estado: EstadoPedido): 'success' | 'warn' | 'secondary' {
        return {
            PENDIENTE: 'warn',
            ENTREGADO: 'success',
            ANULADO: 'secondary'
        }[estado] as 'success' | 'warn' | 'secondary';
    }

    private formatearFecha(fecha: Date | null): string | undefined {
        if (!fecha) {
            return undefined;
        }

        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');

        const day = String(fecha.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
