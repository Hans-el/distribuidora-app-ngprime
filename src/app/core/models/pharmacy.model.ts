export interface Farmacia {
    id: number;
    nombre: string;
    ciudad: string;
    region: 'AUSTRO' | 'COSTA' | 'SIERRA';
    vendedorActual: string | null;
}

export interface HistorialVendedor {
    vendedor: string;
    fechaDesde: string;
    fechaHasta: string | null;
    vigente: boolean;
}

export interface FarmaciaInactiva {
    id: number;
    nombre: string;
    ciudad: string;
    region: string;
    ultimaVentaEntregada: string | null;
}

export interface Vendedor {
    id: number;
    nombre: string;
}

export interface FarmaciaCreateRequest {
    nombre: string;
    ciudad: string;
    region: 'AUSTRO' | 'COSTA' | 'SIERRA';
    vendedorId: number;
}

export interface FarmaciaUpdateRequest {
    nombre: string;
    ciudad: string;
    region: 'AUSTRO' | 'COSTA' | 'SIERRA';
}

export interface ReasignarVendedorRequest {
    vendedorId: number;
    fecha?: string;
}
