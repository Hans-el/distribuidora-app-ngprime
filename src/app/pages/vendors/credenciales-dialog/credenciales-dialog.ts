import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-credenciales-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule],
    templateUrl: './credenciales-dialog.html'
})
export class CredencialesDialog {
    visible = input.required<boolean>();
    username = input.required<string>();
    password = input.required<string>();
    closed = output<void>();

    copiado = false;

    async copiar(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.password());
            this.copiado = true;
        } catch {
            // Sin permiso de portapapeles (p. ej. HTTP sin localhost): el usuario puede seleccionarla a mano
        }
    }

    cerrar(): void {
        this.copiado = false;
        this.closed.emit();
    }
}
