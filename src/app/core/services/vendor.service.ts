import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Vendedor, VendedorRequest, PasswordTemporal, VendedorCreado, VendedorCreateRequest } from '../models/pharmacy.model';

@Injectable({ providedIn: 'root' })
export class VendorService {
    private base = `${environment.apiUrl}/vendors`;

    constructor(private http: HttpClient) {}

    listar(soloActivos = true) {
        return this.http.get<Vendedor[]>(this.base, { params: { active: soloActivos } });
    }

    crear(request: VendedorCreateRequest) {
        return this.http.post<VendedorCreado>(this.base, request);
    }

    editar(id: number, request: VendedorRequest) {
        return this.http.put<Vendedor>(`${this.base}/${id}`, request);
    }

    cambiarActivo(id: number, activo: boolean) {
        return this.http.patch<Vendedor>(`${this.base}/${id}/status`, { activo });
    }
    resetearPassword(id: number) {
        return this.http.post<PasswordTemporal>(`${this.base}/${id}/reset-password`, {});
    }
}
