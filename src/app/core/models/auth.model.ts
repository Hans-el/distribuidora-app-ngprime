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
}
