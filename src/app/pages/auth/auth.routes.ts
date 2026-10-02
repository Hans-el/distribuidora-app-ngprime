import { Routes } from '@angular/router';

export default [
    {
        path: 'login',
        loadComponent: () => import('./login/login').then((m) => m.Login)
    },
    {
        path: 'access',
        loadComponent: () => import('./access').then((m) => m.Access)
    },
    {
        path: 'error',
        loadComponent: () => import('./error').then((m) => m.Error)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
] as Routes;
