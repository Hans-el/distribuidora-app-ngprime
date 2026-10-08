import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Vendedor, VendedorRequest } from '../models/pharmacy.model';

@Injectable({ providedIn: 'root' })
export class VendorService {
    private base = `${environment.apiUrl}/vendors`;

    constructor(private http: HttpClient) {}

    listar(soloActivos = true) {
        return this.http.get<Vendedor[]>(this.base, { params: { active: soloActivos } });
    }

    crear(request: VendedorRequest) {
        return this.http.post<Vendedor>(this.base, request);
    }

    editar(id: number, request: VendedorRequest) {
        return this.http.put<Vendedor>(`${this.base}/${id}`, request);
    }

    cambiarActivo(id: number, activo: boolean) {
        return this.http.patch<Vendedor>(`${this.base}/${id}/status`, { activo });
    }
}
