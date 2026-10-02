import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoVendido } from '../../../core/models/dashboard.model';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <div class="font-semibold text-xl">Productos más vendidos</div>

                    <div class="text-sm text-muted-color mt-1">Últimos 30 días · pedidos entregados</div>
                </div>
            </div>

            @if (productos().length === 0) {
                <div class="flex flex-col items-center justify-center py-8 text-muted-color">
                    <i class="pi pi-box text-3xl mb-3"></i>

                    <span> No hay productos vendidos en el período. </span>
                </div>
            } @else {
                <ul class="list-none p-0 m-0">
                    @for (producto of productos(); track producto.codigo) {
                        <li
                            class="flex flex-col md:flex-row md:items-center
                                   md:justify-between mb-6 last:mb-0"
                        >
                            <div class="min-w-0">
                                <span
                                    class="text-surface-900 dark:text-surface-0
                                           font-medium mr-2"
                                >
                                    {{ producto.nombre }}
                                </span>

                                <div class="mt-1 text-muted-color text-sm">
                                    {{ producto.codigo }}
                                </div>
                            </div>

                            <div class="mt-2 md:mt-0 flex items-center">
                                <div
                                    class="bg-surface-300 dark:bg-surface-500
                                           rounded-border overflow-hidden
                                           w-40 lg:w-32"
                                    style="height: 8px"
                                >
                                    <div class="bg-primary h-full" [style.width.%]="producto.porcentaje"></div>
                                </div>

                                <span
                                    class="text-primary ml-4 font-medium
                                           whitespace-nowrap"
                                >
                                    {{ producto.cantidad }} uds.
                                </span>
                            </div>
                        </li>
                    }
                </ul>
            }
        </div>
    `
})
export class BestSellingWidget {
    productos = input.required<ProductoVendido[]>();
}
