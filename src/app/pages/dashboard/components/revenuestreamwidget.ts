import { afterNextRender, Component, effect, inject, input, signal } from '@angular/core';

import { ChartModule } from 'primeng/chart';

import { LayoutService } from '@/app/layout/service/layout.service';

import { VentaDiaria } from '../../../core/models/dashboard.model';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `
        <div class="card mb-8!">
            <div class="font-semibold text-xl mb-1">Evolución de ventas</div>

            <div class="text-sm text-muted-color mb-4">Ventas diarias · últimos 30 días</div>

            <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-100" />
        </div>
    `
})
export class RevenueStreamWidget {
    private layoutService = inject(LayoutService);

    ventas = input.required<VentaDiaria[]>();

    chartData = signal<any>(null);

    chartOptions = signal<any>(null);

    constructor() {
        afterNextRender(() => {
            this.initChart();
        });

        effect(() => {
            this.ventas();

            // Hace que el gráfico se adapte al cambio
            // entre tema claro y oscuro.
            this.layoutService.layoutConfig().darkTheme;

            setTimeout(() => {
                this.initChart();
            }, 150);
        });
    }

    private initChart(): void {
        const ventas = this.ventas();

        const documentStyle = getComputedStyle(document.documentElement);

        const textColor = documentStyle.getPropertyValue('--text-color');

        const borderColor = documentStyle.getPropertyValue('--surface-border');

        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartData.set({
            labels: ventas.map((v) => this.formatearFecha(v.fecha)),

            datasets: [
                {
                    label: 'Ventas',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),

                    data: ventas.map((v) => v.venta),

                    borderRadius: {
                        topLeft: 6,
                        topRight: 6,
                        bottomLeft: 0,
                        bottomRight: 0
                    },

                    borderSkipped: false,

                    barThickness: 12
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,

            aspectRatio: 0.8,

            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },

                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const value = context.raw ?? 0;

                            return ` Ventas: ${new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(value)}`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: textMutedColor,

                        maxRotation: 45,
                        minRotation: 45
                    },

                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: textMutedColor,

                        callback: (value: number) => {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                    },

                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        });
    }

    private formatearFecha(fecha: string): string {
        const [, mes, dia] = fecha.split('-');

        return `${dia}/${mes}`;
    }
}
