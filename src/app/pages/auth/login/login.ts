import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    loading = signal(false);
    error = signal<string | null>(null);

    form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.auth
            .login(
                this.form.getRawValue() as {
                    username: string;
                    password: string;
                }
            )
            .subscribe({
                next: () => {
                    this.loading.set(false);
                    this.router.navigateByUrl('/orders');
                },
                error: () => {
                    this.loading.set(false);
                    this.error.set('Usuario o contraseña incorrectos');
                }
            });
    }
}
