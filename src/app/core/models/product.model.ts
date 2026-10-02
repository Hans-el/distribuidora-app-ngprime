export interface Laboratorio {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    laboratorio: string;
    precioLista: number;
    activo: boolean;
}

export interface ProductoRequest {
    codigo: string;
    nombre: string;
    laboratorioId: number;
    precioLista: number;
}
