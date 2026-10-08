import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer text-muted-color text-sm">
        Sistema de Gestión de Distribución Farmacéutica -
        <a href="https://hanselfuentes.vercel.app" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Nombre Empresa</a>
    </div>`
})
export class AppFooter {}
