import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@/app/core/services/auth.service';
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, MessageModule, AppFloatingConfigurator],
    templateUrl: './login.html'
})
export class Login {
    private auth = inject(AuthService);
    private router = inject(Router);

    username = '';
    password = '';

    loading = signal(false);
    error = signal<string | null>(null);

    login(): void {
        this.error.set(null);
        if (!this.username.trim() || !this.password) {
            this.error.set('Ingrese usuario y contraseña.');
            return;
        }
        this.loading.set(true);
        this.auth
            .login({
                username: this.username.trim(),
                password: this.password
            })
            .subscribe({
                next: () => {
                    this.loading.set(false);
                    this.router.navigateByUrl(this.auth.debeCambiarPassword() ? '/change-password' : '/dashboard');
                },
                error: (error) => {
                    this.loading.set(false);
                    this.error.set(error.status === 429 ? error.error?.message : 'Usuario o contraseña incorrectos');
                }
            });
    }
}
