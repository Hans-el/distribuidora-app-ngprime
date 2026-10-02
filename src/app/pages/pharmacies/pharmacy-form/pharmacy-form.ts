import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../../core/services/auth.service';
import { PharmacyService } from '../../../core/services/pharmacy.service';
import { VendorService } from '../../../core/services/vendor.service';

import { Farmacia, FarmaciaCreateRequest, FarmaciaUpdateRequest, Vendedor } from '../../../core/models/pharmacy.model';

interface FormState {
    id: number | null;
    nombre: string;
    ciudad: string;
    region: 'AUSTRO' | 'COSTA' | 'SIERRA' | null;
    vendedorId: number | null;
}

@Component({
    selector: 'app-pharmacy-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, MessageModule, SelectModule],
    templateUrl: './pharmacy-form.html'
})
export class PharmacyForm implements OnInit {
    private pharmacyService = inject(PharmacyService);
    private vendorService = inject(VendorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    auth = inject(AuthService);

    vendedores = signal<Vendedor[]>([]);

    loading = signal(false);
    guardando = signal(false);

    error = signal<string | null>(null);

    form: FormState = this.formVacio();

    get esEdicion(): boolean {
        return this.form.id !== null;
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.cargarFarmacia(Number(id));
        } else {
            this.cargarVendedores();
        }
    }

    private cargarVendedores(): void {
        if (!this.auth.isJefatura()) {
            return;
        }

        this.vendorService.listar().subscribe({
            next: (vendedores) => {
                this.vendedores.set(vendedores);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudieron cargar los vendedores');
            }
        });
    }

    private cargarFarmacia(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.pharmacyService.listar().subscribe({
            next: (farmacias) => {
                const farmacia = farmacias.find((f) => f.id === id);

                if (!farmacia) {
                    this.error.set('Farmacia no encontrada');
                    this.loading.set(false);
                    return;
                }

                this.cargarFormulario(farmacia);
                this.loading.set(false);
            },

            error: (err) => {
                this.loading.set(false);

                this.error.set(err?.error?.message ?? 'No se pudo cargar la farmacia');
            }
        });
    }

    private cargarFormulario(farmacia: Farmacia): void {
        this.form = {
            id: farmacia.id,
            nombre: farmacia.nombre,
            ciudad: farmacia.ciudad,
            region: farmacia.region,
            vendedorId: null
        };
    }

    private formVacio(): FormState {
        return {
            id: null,
            nombre: '',
            ciudad: '',
            region: null,
            vendedorId: null
        };
    }

    guardar(): void {
        this.error.set(null);

        if (!this.form.nombre.trim() || !this.form.ciudad.trim() || !this.form.region) {
            this.error.set('Completa nombre, ciudad y región');
            return;
        }

        if (!this.form.id && !this.form.vendedorId) {
            this.error.set('Selecciona el vendedor que atenderá esta farmacia');
            return;
        }

        this.guardando.set(true);

        if (this.form.id) {
            const request: FarmaciaUpdateRequest = {
                nombre: this.form.nombre.trim(),
                ciudad: this.form.ciudad.trim(),
                region: this.form.region
            };

            this.pharmacyService.editar(this.form.id, request).subscribe({
                next: () => this.finalizarGuardado(),

                error: (err) => {
                    this.guardando.set(false);

                    this.error.set(err?.error?.message ?? 'No se pudo actualizar la farmacia');
                }
            });
        } else {
            const request: FarmaciaCreateRequest = {
                nombre: this.form.nombre.trim(),
                ciudad: this.form.ciudad.trim(),
                region: this.form.region,
                vendedorId: this.form.vendedorId!
            };

            this.pharmacyService.crear(request).subscribe({
                next: () => this.finalizarGuardado(),

                error: (err) => {
                    this.guardando.set(false);

                    this.error.set(err?.error?.message ?? 'No se pudo crear la farmacia');
                }
            });
        }
    }

    private finalizarGuardado(): void {
        this.guardando.set(false);

        this.router.navigate(['/pharmacies']);
    }

    cancelar(): void {
        this.router.navigate(['/pharmacies']);
    }
}
