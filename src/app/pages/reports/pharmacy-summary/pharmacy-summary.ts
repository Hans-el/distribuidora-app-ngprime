import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { ReportService } from '../../../core/services/report.service';
import { Farmacia } from '../../../core/models/pharmacy.model';
import { ResumenFarmacia } from '../../../core/models/report.model';

@Component({
    selector: 'app-pharmacy-summary',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DatePickerModule, MessageModule, SelectModule],
    templateUrl: './pharmacy-summary.html',
    styleUrl: './pharmacy-summary.scss'
})
export class PharmacySummary implements OnInit {
    private pharmacyService = inject(PharmacyService);
    private reportService = inject(ReportService);

    farmacias = signal<Farmacia[]>([]);
    resumen = signal<ResumenFarmacia | null>(null);

    loading = signal(false);
    error = signal<string | null>(null);

    farmaciaId: number | null = null;

    from = this.hace30Dias();
    to = this.hoy();

    ngOnInit(): void {
        this.pharmacyService.listar().subscribe((f) => {
            this.farmacias.set(f);
        });
    }

    consultar(): void {
        if (!this.farmaciaId) {
            this.error.set('Selecciona una farmacia');
            return;
        }

        this.error.set(null);
        this.loading.set(true);

        this.reportService.resumenFarmacia(this.farmaciaId, this.from, this.to).subscribe({
            next: (r) => {
                this.resumen.set(r);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('No se pudo obtener el resumen');
                this.loading.set(false);
            }
        });
    }

    private hoy(): string {
        return new Date().toISOString().substring(0, 10);
    }

    private hace30Dias(): string {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().substring(0, 10);
    }
}
