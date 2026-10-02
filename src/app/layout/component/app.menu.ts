import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            @for (item of model; track item.label) {
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [root]="true"></li>
                } @else {
                    <li class="menu-separator"></li>
                }
            }
        </ul>
    `
})
export class AppMenu implements OnInit {
    private auth = inject(AuthService);

    model: MenuItem[] = [];

    ngOnInit(): void {
        this.construirMenu();
    }

    private construirMenu(): void {
        const modulos: MenuItem[] = [
            {
                label: 'Pedidos',
                icon: 'pi pi-fw pi-shopping-cart',
                routerLink: ['/orders']
            },
            {
                label: 'Farmacias',
                icon: 'pi pi-fw pi-building',
                routerLink: ['/pharmacies']
            }
        ];

        if (this.auth.isJefatura()) {
            modulos.push(
                {
                    label: 'Productos',
                    icon: 'pi pi-fw pi-box',
                    routerLink: ['/products']
                },
                {
                    label: 'Reportes',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/reports']
                }
            );
        }

        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard']
                    }
                ]
            },
            {
                label: 'Módulos',
                items: modulos
            }
        ];
    }
}
