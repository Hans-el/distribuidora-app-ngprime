import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResumenFarmacia } from '../models/report.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private base = `${environment.apiUrl}/reports`;

    constructor(private http: HttpClient) {}

    resumenFarmacia(farmaciaId: number, from: string, to: string) {
        return this.http.get<ResumenFarmacia>(`${this.base}/pharmacy-summary`, {
            params: { pharmacyId: farmaciaId, from, to }
        });
    }
}
