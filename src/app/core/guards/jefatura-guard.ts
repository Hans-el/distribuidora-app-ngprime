import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protege rutas exclusivas de JEFATURA (ej. farmacias inactivas). */
export const jefaturaGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isJefatura()) {
        return true;
    }
    return router.createUrlTree(['/orders']);
};
