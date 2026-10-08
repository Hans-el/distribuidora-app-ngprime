import { Routes } from '@angular/router';

import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/core/guards/auth-guard';
import { jefaturaGuard } from './app/core/guards/jefatura-guard';

export const appRoutes: Routes = [
    //  RUTAS PÚBLICAS
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./app/pages/auth/login/login').then((m) => m.Login)
            }
        ]
    },
    // RUTAS AUTENTICADA
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // Dashboard
            {
                path: 'dashboard',
                component: Dashboard
            },

            // Documentación
            {
                path: 'documentation',
                component: Documentation
            },

            // Páginas de Sakai
            {
                path: 'pages',
                loadChildren: () => import('./app/pages/pages.routes')
            },

            // PEDIDOS
            {
                path: 'orders',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/pages/orders/order-list/order-list').then((m) => m.OrderList)
                    },
                    {
                        path: 'new',
                        loadComponent: () => import('./app/pages/orders/order-form/order-form').then((m) => m.OrderForm)
                    },
                    {
                        path: ':id/edit',
                        loadComponent: () => import('./app/pages/orders/order-form/order-form').then((m) => m.OrderForm)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./app/pages/orders/order-details/order-details').then((m) => m.OrderDetails)
                    }
                ]
            },
            // FARMACIAS
            {
                path: 'pharmacies',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/pages/pharmacies/pharmacy-list/pharmacy-list').then((m) => m.PharmacyList)
                    },
                    {
                        path: 'new',
                        canActivate: [jefaturaGuard],
                        loadComponent: () => import('./app/pages/pharmacies/pharmacy-form/pharmacy-form').then((m) => m.PharmacyForm)
                    },
                    {
                        path: ':id/edit',
                        canActivate: [jefaturaGuard],
                        loadComponent: () => import('./app/pages/pharmacies/pharmacy-form/pharmacy-form').then((m) => m.PharmacyForm)
                    },
                    {
                        path: ':id/history',
                        loadComponent: () => import('./app/pages/pharmacies/pharmacy-history/pharmacy-history').then((m) => m.PharmacyHistory)
                    }
                ]
            },
            // PRODUCTOS - [ROL JEFATURA]
            {
                path: 'products',
                canActivate: [jefaturaGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/pages/products/product-list/product-list').then((m) => m.ProductList)
                    },
                    {
                        path: 'new',
                        loadComponent: () => import('./app/pages/products/product-form/product-form').then((m) => m.ProductForm)
                    },
                    {
                        path: ':id/edit',
                        loadComponent: () => import('./app/pages/products/product-form/product-form').then((m) => m.ProductForm)
                    }
                ]
            },
            // VENDEDORES - [ROL JEFATURA]
            {
                path: 'vendors',
                canActivate: [jefaturaGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/pages/vendors/vendor-list/vendor-list').then((m) => m.VendorList)
                    },
                    {
                        path: 'new',
                        loadComponent: () => import('./app/pages/vendors/vendor-form/vendor-form').then((m) => m.VendorForm)
                    },
                    {
                        path: ':id/edit',
                        loadComponent: () => import('./app/pages/vendors/vendor-form/vendor-form').then((m) => m.VendorForm)
                    }
                ]
            },
            // REPORTES - [ROL JEFATURA]
            {
                path: 'reports',
                canActivate: [jefaturaGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/pages/reports/pharmacy-summary/pharmacy-summary').then((m) => m.PharmacySummary)
                    },
                    {
                        path: 'pharmacy-summary',
                        loadComponent: () => import('./app/pages/reports/pharmacy-summary/pharmacy-summary').then((m) => m.PharmacySummary)
                    }
                ]
            }
        ]
    },
    // ERROR
    {
        path: 'notfound',
        component: Notfound
    },

    {
        path: '**',
        redirectTo: '/notfound'
    }
];
