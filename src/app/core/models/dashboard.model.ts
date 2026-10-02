export interface DashboardStats {
    ventasNetas: number;
    pedidosEntregados: number;
    pedidosPendientes: number;
    pedidosAnulados: number;
    farmaciasActivas: number;
    ticketPromedio: number;
}

export interface ProductoVendido {
    codigo: string;
    nombre: string;
    cantidad: number;
    porcentaje: number;
}

export interface VentaDiaria {
    fecha: string;
    venta: number;
}

export interface DashboardData {
    stats: DashboardStats;
    productosMasVendidos: ProductoVendido[];
    ventasDiarias: VentaDiaria[];
    pedidosRecientes: PedidoDashboard[];
}

export interface PedidoDashboard {
    id: number;
    fecha: string;
    farmaciaNombre: string;
    vendedorNombre: string;
    estado: 'PENDIENTE' | 'ENTREGADO' | 'ANULADO';
    total: number;
}
