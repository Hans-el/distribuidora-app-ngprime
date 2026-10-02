export type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'ANULADO';

export interface PedidoLineaRequest {
  productoId: number;
  cantidad: number;
  descuentoPct: number;
}

export interface PedidoRequest {
  farmaciaId: number;
  fecha?: string;
  lineas: PedidoLineaRequest[];
}

export interface PedidoLinea {
  id: number;
  productoCodigo: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPct: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  farmaciaId: number;
  farmaciaNombre: string;
  vendedorNombre: string;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  lineas: PedidoLinea[];
}
