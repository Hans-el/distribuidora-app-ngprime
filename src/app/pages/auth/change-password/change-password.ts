import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, MessageModule, PasswordModule],
    templateUrl: './change-password.html'
})
export class ChangePassword implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);

    passwordActual = '';
    passwordNueva = '';
    confirmacion = '';

    guardando = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        if (!this.auth.isLoggedIn()) {
            this.router.navigateByUrl('/login');
        }
    }

    guardar(): void {
        this.error.set(null);

        if (!this.passwordActual || !this.passwordNueva) {
            this.error.set('Completa todos los campos');
            return;
        }
        if (this.passwordNueva.length < 8 || this.passwordNueva.length > 72) {
            this.error.set('La nueva contraseña debe tener entre 8 y 72 caracteres');
            return;
        }
        if (this.passwordNueva !== this.confirmacion) {
            this.error.set('La confirmación no coincide con la nueva contraseña');
            return;
        }

        this.guardando.set(true);
        this.auth.cambiarPassword({ passwordActual: this.passwordActual, passwordNueva: this.passwordNueva }).subscribe({
            next: () => {
                this.guardando.set(false);
                this.router.navigateByUrl('/');
            },
            error: (err) => {
                this.guardando.set(false);
                this.error.set(err?.error?.message ?? 'No se pudo cambiar la contraseña');
            }
        });
    }

    salir(): void {
        this.auth.logout();
    }
}
