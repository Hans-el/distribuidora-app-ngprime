import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Gestión de Distribución de Medicamentos -
        <a href="https://verdezoto.com.ec" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Distribuidora Verdezoto</a>
    </div>`
})
export class AppFooter {}
