import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Vendedor } from '../models/pharmacy.model';

@Injectable({ providedIn: 'root' })
export class VendorService {
    private base = `${environment.apiUrl}/vendors`;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<Vendedor[]>(this.base);
    }
}
