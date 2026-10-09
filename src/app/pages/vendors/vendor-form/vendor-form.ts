import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { VendorService } from '../../../core/services/vendor.service';
import { CredencialesDialog } from '../credenciales-dialog/credenciales-dialog';

@Component({
    selector: 'app-vendor-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, MessageModule],
    templateUrl: './vendor-form.html'
})
export class VendorForm implements OnInit {
    private vendorService = inject(VendorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private usernameEditadoAMano = false;

    vendedorId: number | null = null;
    nombre = '';
    username = '';

    loading = signal(false);
    guardando = signal(false);
    error = signal<string | null>(null);

    // Credenciales recién creadas, para el diálogo
    mostrarCredenciales = signal(false);
    credUsername = signal('');
    credPassword = signal('');

    get esEdicion(): boolean {
        return this.vendedorId !== null;
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.cargarVendedor(Number(id));
        }
    }
    private cargarVendedor(id: number): void {
        this.loading.set(true);
        this.vendorService.listar(false).subscribe({
            next: (vendedores) => {
                const vendedor = vendedores.find((v) => v.id === id);
                if (!vendedor) {
                    this.error.set('Vendedor no encontrado');
                } else {
                    this.vendedorId = vendedor.id;
                    this.nombre = vendedor.nombre;
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'No se pudo cargar el vendedor');
                this.loading.set(false);
            }
        });
    }
    // Mientras jefatura no toque el campo usuario, se sugiere nombre.apellido
    onNombreChange(valor: string): void {
        this.nombre = valor;
        if (!this.esEdicion && !this.usernameEditadoAMano) {
            this.username = this.sugerirUsername(valor);
        }
    }

    onUsernameChange(valor: string): void {
        this.username = valor;
        this.usernameEditadoAMano = valor.trim().length > 0;
    }

    private sugerirUsername(nombreCompleto: string): string {
        const palabras = nombreCompleto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // quita tildes
            .toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(Boolean);

        if (palabras.length === 0) return '';
        if (palabras.length === 1) return palabras[0];
        return `${palabras[0]}.${palabras[palabras.length - 1]}`;
    }

    guardar(): void {
        this.error.set(null);

        if (!this.nombre.trim()) {
            this.error.set('El nombre es obligatorio');
            return;
        }

        if (this.esEdicion) {
            this.guardando.set(true);
            this.vendorService.editar(this.vendedorId!, { nombre: this.nombre.trim() }).subscribe({
                next: () => {
                    this.guardando.set(false);
                    this.router.navigate(['/vendors']);
                },
                error: (err) => {
                    this.guardando.set(false);
                    this.error.set(err?.error?.message ?? 'No se pudo guardar el vendedor');
                }
            });
            return;
        }

        if (!/^[A-Za-z0-9._-]{3,60}$/.test(this.username.trim())) {
            this.error.set('El usuario debe tener 3 a 60 caracteres: letras, números, punto, guion o guion bajo');
            return;
        }

        this.guardando.set(true);
        this.vendorService.crear({ nombre: this.nombre.trim(), username: this.username.trim() }).subscribe({
            next: (res) => {
                this.guardando.set(false);
                this.credUsername.set(res.username);
                this.credPassword.set(res.passwordTemporal);
                this.mostrarCredenciales.set(true);
            },
            error: (err) => {
                this.guardando.set(false);
                this.error.set(err?.error?.message ?? 'No se pudo crear el vendedor');
            }
        });
    }

    cerrarCredenciales(): void {
        this.mostrarCredenciales.set(false);
        this.credPassword.set(''); // no dejar la contraseña en memoria del componente
        this.router.navigate(['/vendors']);
    }
}
