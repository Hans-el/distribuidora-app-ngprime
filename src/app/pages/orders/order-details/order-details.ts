import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';

import { OrderService } from '../../../core/services/order.service';
import { EstadoPedido, Pedido } from '../../../core/models/order.model';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule, MessageModule],
    templateUrl: './order-details.html',
    styleUrl: './order-details.scss'
})
export class OrderDetails implements OnInit {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);

    pedido = signal<Pedido | null>(null);
    loading = signal(true);
    actualizando = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.orderService.obtener(id).subscribe({
            next: (pedido) => {
                this.pedido.set(pedido);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudo cargar el pedido');

                this.loading.set(false);
            }
        });
    }

    cambiarEstado(estado: EstadoPedido): void {
        const actual = this.pedido();

        if (!actual) {
            return;
        }

        this.actualizando.set(true);
        this.error.set(null);

        this.orderService.cambiarEstado(actual.id, estado).subscribe({
            next: (pedido) => {
                this.pedido.set(pedido);
                this.actualizando.set(false);
            },

            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudo cambiar el estado');

                this.actualizando.set(false);
            }
        });
    }

    severidadEstado(estado: EstadoPedido): 'success' | 'warn' | 'secondary' {
        return {
            PENDIENTE: 'warn',
            ENTREGADO: 'success',
            ANULADO: 'secondary'
        }[estado] as 'success' | 'warn' | 'secondary';
    }
}
