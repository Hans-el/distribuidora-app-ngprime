import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstadoPedido, Pedido, PedidoRequest } from '../models/order.model';
import { PageResponse } from '../models/page.model';

// usamos FiltrosPedido para filtrar los pedidos en la API.
export interface FiltrosPedido {
    farmaciaId?: number;
    estado?: EstadoPedido;
    from?: string;
    to?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private base = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) {}

    crear(request: PedidoRequest) {
        return this.http.post<Pedido>(this.base, request);
    }

    listar(filtros: FiltrosPedido) {
        let params = new HttpParams();
        if (filtros.farmaciaId) params = params.set('farmaciaId', filtros.farmaciaId);
        if (filtros.estado) params = params.set('estado', filtros.estado);
        if (filtros.from) params = params.set('from', filtros.from);
        if (filtros.to) params = params.set('to', filtros.to);
        return this.http.get<Pedido[]>(this.base, { params });
    }
    listarPaginado(filtros: FiltrosPedido, page = 0, size = 10) {
        let params: Record<string, string | number> = { page, size };
        if (filtros.farmaciaId) params['farmaciaId'] = filtros.farmaciaId;
        if (filtros.estado) params['estado'] = filtros.estado;
        if (filtros.from) params['from'] = filtros.from;
        if (filtros.to) params['to'] = filtros.to;

        return this.http.get<PageResponse<Pedido>>(this.base, { params });
    }

    obtener(id: number) {
        return this.http.get<Pedido>(`${this.base}/${id}`);
    }

    cambiarEstado(id: number, estado: EstadoPedido) {
        return this.http.patch<Pedido>(`${this.base}/${id}/status`, { estado });
    }
}
