import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardData } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);
    private base = `${environment.apiUrl}/reports`;

    cargar() {
        const to = this.formatearFecha(new Date());
        const from = this.formatearFecha(this.hace29Dias());
        return this.http.get<DashboardData>(`${this.base}/dashboard`, { params: { from, to } });
    }

    private hace29Dias(): Date {
        const d = new Date();
        d.setDate(d.getDate() - 29);
        return d;
    }

    private formatearFecha(fecha: Date): string {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
