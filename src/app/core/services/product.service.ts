import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Producto, ProductoRequest } from '../models/product.model';
import { PageResponse } from '../models/page.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private base = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}

    listar(soloActivos = true) {
        return this.http.get<Producto[]>(this.base, { params: { active: soloActivos } });
    }

    listarActivos() {
        return this.listar(true);
    }
    // con paginación, para el listado de productos en la vista de productos
    listarPaginado(soloActivos = false, search = '', page = 0, size = 10) {
        return this.http.get<PageResponse<Producto>>(`${this.base}/page`, {
            params: {
                active: soloActivos,
                search,
                page,
                size
            }
        });
    }
    obtener(id: number) {
        return this.http.get<Producto>(`${this.base}/${id}`);
    }

    crear(request: ProductoRequest) {
        return this.http.post<Producto>(this.base, request);
    }

    editar(id: number, request: ProductoRequest) {
        return this.http.put<Producto>(`${this.base}/${id}`, request);
    }

    cambiarActivo(id: number, activo: boolean) {
        return this.http.patch<Producto>(`${this.base}/${id}/status`, { activo });
    }
}
