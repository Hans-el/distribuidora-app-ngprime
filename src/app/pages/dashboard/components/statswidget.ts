import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardStats } from '../../../core/models/dashboard.model';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4"> Venta neta </span>

                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ stats().ventasNetas | currency: 'USD' : 'symbol' : '1.2-2' }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-green-500 text-xl!"></i>
                    </div>
                </div>

                <span class="text-muted-color"> Últimos 30 días </span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4"> Pedidos entregados </span>

                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ stats().pedidosEntregados }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-blue-500 text-xl!"></i>
                    </div>
                </div>

                <span class="text-primary font-medium"> Completados </span>

                <span class="text-muted-color ml-1"> últimos 30 días </span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4"> Pedidos pendientes </span>

                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ stats().pedidosPendientes }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-clock text-orange-500 text-xl!"></i>
                    </div>
                </div>

                @if (stats().pedidosPendientes > 0) {
                    <span class="text-orange-500 font-medium"> Requieren atención </span>
                } @else {
                    <span class="text-green-500 font-medium"> Sin pendientes </span>
                }
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4"> Ticket promedio </span>

                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ stats().ticketPromedio | currency: 'USD' : 'symbol' : '1.2-2' }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-line text-purple-500 text-xl!"></i>
                    </div>
                </div>

                <span class="text-muted-color"> Por pedido entregado </span>
            </div>
        </div>
    `
})
export class StatsWidget {
    stats = input.required<DashboardStats>();
}
