import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DashboardStats } from '../../../core/models/dashboard.model';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [CommonModule, RouterLink],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="font-semibold text-xl">Alertas operativas</div>

                    <div class="text-sm text-muted-color mt-1">Situación actual</div>
                </div>
            </div>

            <ul class="p-0 m-0 list-none">
                <!-- PEDIDOS PENDIENTES -->
                <li class="flex items-center py-3 border-b border-surface">
                    <div
                        class="w-12 h-12 flex items-center justify-center
                               bg-orange-100 dark:bg-orange-400/10
                               rounded-full mr-4 shrink-0"
                    >
                        <i class="pi pi-clock text-xl! text-orange-500"></i>
                    </div>

                    <div class="flex-1">
                        @if (stats().pedidosPendientes > 0) {
                            <div class="text-surface-900 dark:text-surface-0">
                                Hay
                                <span class="text-orange-500 font-bold">
                                    {{ stats().pedidosPendientes }}
                                </span>
                                pedidos pendientes.
                            </div>

                            <a routerLink="/orders" class="text-primary text-sm font-medium hover:underline"> Revisar pedidos </a>
                        } @else {
                            <div class="text-surface-900 dark:text-surface-0">No hay pedidos pendientes.</div>

                            <span class="text-green-500 text-sm"> Operación al día </span>
                        }
                    </div>
                </li>

                <!-- PEDIDOS ANULADOS -->
                <li class="flex items-center py-3 border-b border-surface">
                    <div
                        class="w-12 h-12 flex items-center justify-center
                               bg-red-100 dark:bg-red-400/10
                               rounded-full mr-4 shrink-0"
                    >
                        <i class="pi pi-times-circle text-xl! text-red-500"></i>
                    </div>

                    <div class="flex-1">
                        @if (stats().pedidosAnulados > 0) {
                            <div class="text-surface-900 dark:text-surface-0">
                                Se registraron
                                <span class="text-red-500 font-bold">
                                    {{ stats().pedidosAnulados }}
                                </span>
                                pedidos anulados.
                            </div>

                            <span class="text-sm text-muted-color"> Últimos 30 días </span>
                        } @else {
                            <div class="text-surface-900 dark:text-surface-0">No se registran pedidos anulados.</div>

                            <span class="text-green-500 text-sm"> Sin anulaciones </span>
                        }
                    </div>
                </li>

                <!-- PEDIDOS ENTREGADOS -->
                <li class="flex items-center py-3 border-b border-surface">
                    <div
                        class="w-12 h-12 flex items-center justify-center
                               bg-blue-100 dark:bg-blue-400/10
                               rounded-full mr-4 shrink-0"
                    >
                        <i class="pi pi-check-circle text-xl! text-blue-500"></i>
                    </div>

                    <div class="flex-1">
                        <div class="text-surface-900 dark:text-surface-0">
                            <span class="text-blue-500 font-bold">
                                {{ stats().pedidosEntregados }}
                            </span>
                            pedidos entregados.
                        </div>

                        <span class="text-sm text-muted-color"> Últimos 30 días </span>
                    </div>
                </li>

                <!-- TICKET PROMEDIO -->
                <li class="flex items-center py-3">
                    <div
                        class="w-12 h-12 flex items-center justify-center
                               bg-purple-100 dark:bg-purple-400/10
                               rounded-full mr-4 shrink-0"
                    >
                        <i class="pi pi-chart-line text-xl! text-purple-500"></i>
                    </div>

                    <div class="flex-1">
                        <div class="text-surface-900 dark:text-surface-0">
                            Ticket promedio:
                            <span class="text-primary font-bold">
                                {{ stats().ticketPromedio | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </span>
                        </div>

                        <span class="text-sm text-muted-color"> Por pedido entregado · últimos 30 días </span>
                    </div>
                </li>
            </ul>
        </div>
    `
})
export class NotificationsWidget {
    stats = input.required<DashboardStats>();
}
