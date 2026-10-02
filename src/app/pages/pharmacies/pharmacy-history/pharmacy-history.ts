import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { HistorialVendedor } from '../../../core/models/pharmacy.model';

@Component({
    selector: 'app-pharmacy-history',
    standalone: true,
    imports: [RouterLink, FormsModule, ButtonModule, DatePickerModule, MessageModule, TableModule, TagModule],
    templateUrl: './pharmacy-history.html',
    styleUrl: './pharmacy-history.scss'
})
export class PharmacyHistory implements OnInit {
    private route = inject(ActivatedRoute);
    private pharmacyService = inject(PharmacyService);

    farmaciaId!: number;

    historial = signal<HistorialVendedor[]>([]);
    loading = signal(true);

    // Requerimiento 7: consultar quién atendía
    // la farmacia en una fecha puntual.
    fechaConsulta: Date | null = null;

    resultadoFecha = signal<HistorialVendedor | null>(null);
    errorFecha = signal<string | null>(null);

    ngOnInit(): void {
        this.farmaciaId = Number(this.route.snapshot.paramMap.get('id'));

        this.pharmacyService.historial(this.farmaciaId).subscribe({
            next: (data) => {
                this.historial.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    consultarFecha(): void {
        if (!this.fechaConsulta) return;

        this.errorFecha.set(null);
        this.resultadoFecha.set(null);

        const fecha = this.formatearFecha(this.fechaConsulta);

        this.pharmacyService.vendedorEnFecha(this.farmaciaId, fecha).subscribe({
            next: (r) => {
                this.resultadoFecha.set(r);
            },
            error: () => {
                this.errorFecha.set('No había un vendedor asignado en esa fecha');
            }
        });
    }

    private formatearFecha(fecha: Date): string {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');

        const day = String(fecha.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
