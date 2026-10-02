import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Laboratorio } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class LaboratoryService {
    private base = `${environment.apiUrl}/laboratories`;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<Laboratorio[]>(this.base);
    }

    crear(nombre: string) {
        return this.http.post<Laboratorio>(this.base, { nombre });
    }
}
