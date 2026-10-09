import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Si el backend responde 401 (token inválido/expirado), cierra sesión y manda al login. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && auth.isLoggedIn()) {
                auth.logout();
                router.navigateByUrl('/login');
            } else if (err.status === 403 && err.error?.error === 'PASSWORD_CHANGE_REQUIRED') {
                router.navigateByUrl('/change-password');
            }
            return throwError(() => err);
        })
    );
};
