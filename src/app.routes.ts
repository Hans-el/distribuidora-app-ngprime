import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { jefaturaGuard } from './app/core/guards/jefatura-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            {
                path: 'uikit',
                loadChildren: () => import('./app/pages/uikit/uikit.routes')
            },
            {
                path: 'documentation',
                component: Documentation
            },
            {
                path: 'pages',
                loadChildren: () => import('./app/pages/pages.routes')
            },
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
                        path: ':id',
                        loadComponent: () => import('./app/pages/orders/order-details/order-details').then((m) => m.OrderDetails)
                    }
                ]
            },
            {
                path: 'pharmacies',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/pages/pharmacies/pharmacy-list/pharmacy-list').then((m) => m.PharmacyList)
                    },
                    {
                        path: 'new',
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

    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        loadChildren: () => import('./app/pages/auth/auth.routes')
    },

    { path: '**', redirectTo: '/notfound' }
];
