import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../core/services/auth.service';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { VendorService } from '../../../core/services/vendor.service';
import { HistorialVendedor, Vendedor } from '../../../core/models/pharmacy.model';

@Component({
    selector: 'app-pharmacy-history',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, DatePickerModule, MessageModule, SelectModule, TableModule, TagModule],
    templateUrl: './pharmacy-history.html'
})
export class PharmacyHistory implements OnInit {
    private route = inject(ActivatedRoute);
    private pharmacyService = inject(PharmacyService);
    private vendorService = inject(VendorService);
    auth = inject(AuthService);

    farmaciaId!: number;
    historial = signal<HistorialVendedor[]>([]);
    loading = signal(true);

    // Consulta "¿quién atendía en esta fecha?"
    fechaConsulta: Date | null = null;
    resultadoFecha = signal<HistorialVendedor | null>(null);
    errorFecha = signal<string | null>(null);

    // Reasignación
    vendedores = signal<Vendedor[]>([]);
    mostrarReasignar = signal(false);
    nuevoVendedorId: number | null = null;
    fechaReasignacion: Date = new Date();
    guardandoReasignacion = signal(false);
    errorReasignacion = signal<string | null>(null);

    ngOnInit(): void {
        this.farmaciaId = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarHistorial();

        if (this.auth.isJefatura()) {
            // listar() sin argumentos = solo vendedores activos
            this.vendorService.listar().subscribe((v) => this.vendedores.set(v));
        }
    }

    // Se arma con componentes locales: toISOString() convierte a UTC y
    // por la noche podría mandar el día siguiente.
    private formatearFecha(d: Date): string {
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mes}-${dia}`;
    }

    private cargarHistorial(): void {
        this.loading.set(true);
        this.pharmacyService.historial(this.farmaciaId).subscribe({
            next: (data) => {
                this.historial.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    consultarFecha(): void {
        if (!this.fechaConsulta) return;

        this.errorFecha.set(null);
        this.resultadoFecha.set(null);

        this.pharmacyService.vendedorEnFecha(this.farmaciaId, this.formatearFecha(this.fechaConsulta)).subscribe({
            next: (r) => this.resultadoFecha.set(r),
            error: () => this.errorFecha.set('No había un vendedor asignado en esa fecha')
        });
    }

    abrirReasignar(): void {
        this.nuevoVendedorId = null;
        this.fechaReasignacion = new Date();
        this.errorReasignacion.set(null);
        this.mostrarReasignar.set(true);
    }

    guardarReasignacion(): void {
        if (!this.nuevoVendedorId) {
            this.errorReasignacion.set('Selecciona el nuevo vendedor');
            return;
        }

        this.errorReasignacion.set(null);
        this.guardandoReasignacion.set(true);

        this.pharmacyService
            .reasignarVendedor(this.farmaciaId, {
                vendedorId: this.nuevoVendedorId,
                fecha: this.formatearFecha(this.fechaReasignacion)
            })
            .subscribe({
                next: () => {
                    this.guardandoReasignacion.set(false);
                    this.mostrarReasignar.set(false);
                    this.cargarHistorial();
                },
                error: (err) => {
                    this.guardandoReasignacion.set(false);
                    this.errorReasignacion.set(err?.error?.message ?? 'No se pudo reasignar el vendedor');
                }
            });
    }
}
