export type Rol = 'VENDEDOR' | 'JEFATURA';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    username: string;
    nombre: string;
    rol: Rol;
    vendedorId: number | null;
    debeCambiarPassword: boolean;
}

export interface ChangePasswordRequest {
    passwordActual: string;
    passwordNueva: string;
}
