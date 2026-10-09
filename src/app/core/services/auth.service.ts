import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest, LoginRequest, LoginResponse, Rol } from '../models/auth.model';

const TOKEN_KEY = 'distribuidora_token';

interface DecodedSession {
    username: string;
    nombre: string;
    rol: Rol;
    vendedorId: number | null;
    debeCambiarPassword: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Signal como fuente única de verdad de la sesión; se hidrata desde localStorage al arrancar.
    private sessionSignal = signal<DecodedSession | null>(this.readFromStorage());

    session = this.sessionSignal.asReadonly();
    isLoggedIn = computed(() => this.sessionSignal() !== null);
    isJefatura = computed(() => this.sessionSignal()?.rol === 'JEFATURA');
    nombre = computed(() => this.sessionSignal()?.nombre ?? '');
    rol = computed<Rol | null>(() => this.sessionSignal()?.rol ?? null);
    debeCambiarPassword = computed(() => this.sessionSignal()?.debeCambiarPassword ?? false);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    private guardarSesion(res: LoginResponse): void {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.sessionSignal.set(this.decode(res.token));
    }
    login(credentials: LoginRequest) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(tap((res) => this.guardarSesion(res)));
    }

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        this.sessionSignal.set(null);
        this.router.navigateByUrl('/login');
    }

    token(): string | null {
        const raw = localStorage.getItem(TOKEN_KEY);
        // Si el token fue manipulado o venció, lo tratamos como si no existiera.
        return raw && this.decode(raw) ? raw : null;
    }
    cambiarPassword(request: ChangePasswordRequest) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/change-password`, request).pipe(tap((res) => this.guardarSesion(res)));
    }

    private readFromStorage(): DecodedSession | null {
        const raw = localStorage.getItem(TOKEN_KEY);
        return raw ? this.decode(raw) : null;
    }
    /**
     * Decodifica el payload del JWT SOLO para mostrarlo en la UI.
     * Esto NO verifica la firma (eso solo lo puede hacer quien tiene JWT_SECRET,
     * es decir, el backend). Lo que gana esta técnica: si alguien edita el token
     * a mano para "forzar" otro rol, el resultado deja de ser un JSON/base64
     * válido (o, aunque lo fuera, el backend rechazará la firma en la próxima
     * petición con 401). No hay ningún campo plano editable que aceptemos sin más.
     */
    private decode(token: string): DecodedSession | null {
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
            const json = decodeURIComponent(
                atob(padded)
                    .split('')
                    .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                    .join('')
            );
            const claims = JSON.parse(json);

            if (claims.exp && Date.now() >= claims.exp * 1000) {
                return null; // token vencido
            }

            return {
                username: claims.sub,
                nombre: claims.nombre,
                rol: claims.rol,
                vendedorId: claims.vendedorId === '' ? null : Number(claims.vendedorId),
                debeCambiarPassword: claims.debeCambiarPassword
            };
        } catch {
            return null; // token corrupto / manipulado a mano
        }
    }
}
