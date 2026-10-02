import { Component, inject, OnInit, signal } from '@angular/core';

import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData } from '../../core/models/dashboard.model';

import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { NotificationsWidget } from './components/notificationswidget';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    template: `
        @if (loading()) {
            <div class="flex items-center justify-center py-20">
                <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
            </div>
        } @else if (error()) {
            <div class="card">
                <div class="flex items-center gap-3 text-red-500">
                    <i class="pi pi-exclamation-circle"></i>
                    <span>{{ error() }}</span>
                </div>
            </div>
        } @else if (dashboard(); as data) {
            <div class="grid grid-cols-12 gap-8">
                <app-stats-widget class="contents" [stats]="data.stats" />

                <div class="col-span-12 xl:col-span-6">
                    <app-recent-sales-widget [pedidos]="data.pedidosRecientes" />

                    <app-best-selling-widget [productos]="data.productosMasVendidos" />
                </div>

                <div class="col-span-12 xl:col-span-6">
                    <app-revenue-stream-widget [ventas]="data.ventasDiarias" />

                    <app-notifications-widget [stats]="data.stats" />
                </div>
            </div>
        }
    `
})
export class Dashboard implements OnInit {
    private dashboardService = inject(DashboardService);

    dashboard = signal<DashboardData | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.dashboardService.cargar().subscribe({
            next: (data) => {
                this.dashboard.set(data as DashboardData);
                this.loading.set(false);
            },

            error: () => {
                this.error.set('No se pudo cargar la información del dashboard');

                this.loading.set(false);
            }
        });
    }
}
