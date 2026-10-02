import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Farmacia, FarmaciaCreateRequest, FarmaciaInactiva, FarmaciaUpdateRequest, HistorialVendedor, ReasignarVendedorRequest } from '../models/pharmacy.model';

@Injectable({
    providedIn: 'root'
})
export class PharmacyService {
    private base = `${environment.apiUrl}/pharmacies`;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<Farmacia[]>(this.base);
    }

    inactivas(dias = 60) {
        return this.http.get<FarmaciaInactiva[]>(`${this.base}/inactive`, { params: { days: dias } });
    }

    historial(farmaciaId: number) {
        return this.http.get<HistorialVendedor[]>(`${this.base}/${farmaciaId}/vendor-history`);
    }

    vendedorEnFecha(farmaciaId: number, fecha: string) {
        return this.http.get<HistorialVendedor>(`${this.base}/${farmaciaId}/vendor-at`, {
            params: { date: fecha }
        });
    }
    crear(request: FarmaciaCreateRequest) {
        return this.http.post<Farmacia>(this.base, request);
    }

    editar(id: number, request: FarmaciaUpdateRequest) {
        return this.http.put<Farmacia>(`${this.base}/${id}`, request);
    }

    reasignarVendedor(id: number, request: ReasignarVendedorRequest) {
        return this.http.post<Farmacia>(`${this.base}/${id}/reassign-vendor`, request);
    }
}
