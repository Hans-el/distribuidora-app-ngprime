export interface ResumenFarmacia {
  farmaciaId: number;
  farmaciaNombre: string;
  desde: string;
  hasta: string;
  pedidosEntregados: number;
  ventaNeta: number;
  productoMasVendidoCodigo: string | null;
  productoMasVendidoNombre: string | null;
  productoMasVendidoCantidad: number | null;
}
