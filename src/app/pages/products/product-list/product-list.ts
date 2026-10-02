import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProductService } from '../../../core/services/product.service';
import { Producto } from '../../../core/models/product.model';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, TableModule, TagModule, TooltipModule],
    templateUrl: './product-list.html',
    styleUrl: './product-list.scss'
})
export class ProductList {
    private productService = inject(ProductService);

    productos = signal<Producto[]>([]);
    loading = signal(false);

    search = '';

    page = 0;
    size = 10;
    totalRecords = 0;

    cargarProductos(): void {
        this.loading.set(true);

        this.productService.listarPaginado(false, this.search.trim(), this.page, this.size).subscribe({
            next: (response) => {
                this.productos.set(response.content);
                this.totalRecords = response.totalElements;
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    buscar(): void {
        this.page = 0;
        this.cargarProductos();
    }
    onPageChange(event: TableLazyLoadEvent): void {
        this.page = Math.floor((event.first ?? 0) / (event.rows ?? this.size));
        this.size = event.rows ?? this.size;
        this.cargarProductos();
    }

    toggleActivo(producto: Producto): void {
        this.productService.cambiarActivo(producto.id, !producto.activo).subscribe({
            next: () => this.cargarProductos()
        });
    }
}
