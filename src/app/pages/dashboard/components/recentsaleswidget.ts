import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { PedidoDashboard } from '../../../core/models/dashboard.model';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, TagModule, RouterLink],
    template: `
        <div class="card mb-8!">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <div class="font-semibold text-xl">Pedidos recientes</div>

                    <div class="text-sm text-muted-color mt-1">Últimos pedidos registrados</div>
                </div>

                <a routerLink="/orders" class="text-primary font-medium text-sm hover:underline"> Ver todos </a>
            </div>

            <p-table [value]="pedidos()" responsiveLayout="scroll" [tableStyle]="{ 'min-width': '40rem' }">
                <ng-template #header>
                    <tr>
                        <th>Pedido</th>
                        <th>Farmacia</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th class="text-right">Total</th>
                    </tr>
                </ng-template>

                <ng-template #body let-pedido>
                    <tr>
                        <td>
                            <a [routerLink]="['/orders', pedido.id]" class="font-medium text-primary hover:underline"> #{{ pedido.id }} </a>
                        </td>

                        <td>
                            <span
                                class="text-surface-900 dark:text-surface-0
                                       font-medium"
                            >
                                {{ pedido.farmaciaNombre }}
                            </span>

                            <div class="text-sm text-muted-color mt-1">
                                {{ pedido.vendedorNombre }}
                            </div>
                        </td>

                        <td>
                            {{ pedido.fecha | date: 'dd/MM/yyyy' }}
                        </td>

                        <td>
                            <p-tag [value]="estadoLabel(pedido.estado)" [severity]="estadoSeverity(pedido.estado)" />
                        </td>

                        <td class="text-right font-medium">
                            {{ pedido.total | currency: 'USD' : 'symbol' : '1.2-2' }}
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5">
                            <div
                                class="flex flex-col items-center
                                       justify-center py-8 text-muted-color"
                            >
                                <i class="pi pi-shopping-cart text-3xl mb-3"></i>

                                <span> No hay pedidos recientes. </span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class RecentSalesWidget {
    pedidos = input.required<PedidoDashboard[]>();

    estadoLabel(estado: PedidoDashboard['estado']): string {
        switch (estado) {
            case 'ENTREGADO':
                return 'Entregado';

            case 'PENDIENTE':
                return 'Pendiente';

            case 'ANULADO':
                return 'Anulado';
        }
    }

    estadoSeverity(estado: PedidoDashboard['estado']): 'success' | 'warn' | 'danger' {
        switch (estado) {
            case 'ENTREGADO':
                return 'success';

            case 'PENDIENTE':
                return 'warn';

            case 'ANULADO':
                return 'danger';
        }
    }
}
