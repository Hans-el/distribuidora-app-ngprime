import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { PopoverModule } from 'primeng/popover';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, PopoverModule, AppConfigurator],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>

                <a class="layout-topbar-logo" routerLink="dashboard">
                    <span>Distribuidora & Ventas</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <!-- Tema -->
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i
                            [ngClass]="{
                                'pi ': true,
                                'pi-moon': layoutService.isDarkTheme(),
                                'pi-sun': !layoutService.isDarkTheme()
                            }"
                        ></i>
                    </button>

                    <!-- Configurador -->
                    <div class="relative">
                        <button
                            type="button"
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>

                        <app-configurator />
                    </div>
                </div>

                <!-- Menú móvil -->
                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <!-- Acciones -->
                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <!-- <button type="button" class="layout-topbar-action">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button> -->
                        <!-- 
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button> -->

                        <!-- Perfil -->
                        <button type="button" class="layout-topbar-action" (click)="profile.toggle($event)">
                            <i class="pi pi-user"></i>
                            <span>{{ auth.nombre() }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Popover del perfil -->
        <p-popover #profile>
            <div class="w-64">
                <!-- Usuario -->
                <div class="flex items-center gap-3 pb-4">
                    <div
                        class="flex items-center justify-center
                               w-10 h-10 rounded-full
                               bg-primary text-primary-contrast"
                    >
                        <i class="pi pi-user"></i>
                    </div>
                    <div class="min-w-0">
                        <div
                            class="font-semibold text-surface-900
                                   dark:text-surface-0 truncate"
                        >
                            {{ auth.nombre() }}
                        </div>
                        <div
                            class="text-sm text-surface-500
                                   dark:text-surface-400"
                        >
                            {{ auth.rol() }}
                        </div>
                    </div>
                </div>

                <div
                    class="border-t border-surface-200
                           dark:border-surface-700 pt-3"
                >
                    <!-- Cerrar sesión -->
                    <button
                        type="button"
                        class="flex items-center gap-3 w-full
                               p-2 rounded-border
                               text-surface-700
                               dark:text-surface-200
                               hover:bg-surface-100
                               dark:hover:bg-surface-800
                               transition-colors"
                        (click)="logout(profile)"
                    >
                        <i class="pi pi-sign-out"></i>

                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </p-popover>
    `
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    auth = inject(AuthService);
    router = inject(Router);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    logout(profile: any): void {
        profile.hide();
        this.auth.logout();
        // Redirigir a la página de inicio de sesión
        this.router.navigate(['/auth/login']);
    }
}
