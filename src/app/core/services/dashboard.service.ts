import { Injectable, inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { OrderService } from './order.service';
import { PharmacyService } from './pharmacy.service';
import { ProductService } from './product.service';
import { DashboardData, DashboardStats, PedidoDashboard, ProductoVendido, VentaDiaria } from '../models/dashboard.model';
import { Pedido } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private orderService = inject(OrderService);
    private pharmacyService = inject(PharmacyService);
    private productService = inject(ProductService);

    cargar(): ReturnType<typeof forkJoin> {
        const from = this.fechaHace30Dias();
        const to = this.fechaHoy();

        return forkJoin({
            pedidos: this.orderService.listar({
                from,
                to
            }),
            farmacias: this.pharmacyService.listar(),
            productos: this.productService.listar(false)
        }).pipe(
            map(({ pedidos, farmacias, productos }) => {
                const stats = this.calcularStats(pedidos, farmacias.length);
                const productosMasVendidos = this.calcularProductosMasVendidos(pedidos);
                const ventasDiarias = this.calcularVentasDiarias(pedidos);
                const pedidosRecientes = this.calcularPedidosRecientes(pedidos);
                return {
                    stats,
                    productosMasVendidos,
                    ventasDiarias,
                    pedidosRecientes
                } satisfies DashboardData;
            })
        );
    }

    private calcularStats(pedidos: Pedido[], farmaciasActivas: number): DashboardStats {
        const entregados = pedidos.filter((p) => p.estado === 'ENTREGADO');
        const pendientes = pedidos.filter((p) => p.estado === 'PENDIENTE');
        const anulados = pedidos.filter((p) => p.estado === 'ANULADO');
        const ventasNetas = entregados.reduce((total, pedido) => total + pedido.total, 0);
        const ticketPromedio = entregados.length > 0 ? ventasNetas / entregados.length : 0;
        return {
            ventasNetas,
            pedidosEntregados: entregados.length,
            pedidosPendientes: pendientes.length,
            pedidosAnulados: anulados.length,
            farmaciasActivas,
            ticketPromedio
        };
    }

    private calcularProductosMasVendidos(pedidos: Pedido[]): ProductoVendido[] {
        const cantidades = new Map<
            string,
            {
                codigo: string;
                nombre: string;
                cantidad: number;
            }
        >();
        const entregados = pedidos.filter((p) => p.estado === 'ENTREGADO');
        for (const pedido of entregados) {
            for (const linea of pedido.lineas) {
                const existente = cantidades.get(linea.productoCodigo);
                if (existente) {
                    existente.cantidad += linea.cantidad;
                } else {
                    cantidades.set(linea.productoCodigo, {
                        codigo: linea.productoCodigo,
                        nombre: linea.productoNombre,
                        cantidad: linea.cantidad
                    });
                }
            }
        }

        const productos = Array.from(cantidades.values())
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 6);

        const maxCantidad = productos.length > 0 ? productos[0].cantidad : 1;
        return productos.map((p) => ({
            ...p,
            porcentaje: Math.round((p.cantidad / maxCantidad) * 100)
        }));
    }

    private calcularVentasDiarias(pedidos: Pedido[]): VentaDiaria[] {
        const ventas = new Map<string, number>();
        for (const pedido of pedidos) {
            if (pedido.estado !== 'ENTREGADO') {
                continue;
            }
            const fecha = pedido.fecha.substring(0, 10);
            ventas.set(fecha, (ventas.get(fecha) ?? 0) + pedido.total);
        }

        const resultado: VentaDiaria[] = [];
        const inicio = new Date();
        inicio.setDate(inicio.getDate() - 29);
        for (let i = 0; i < 30; i++) {
            const fecha = new Date(inicio);
            fecha.setDate(inicio.getDate() + i);
            const key = `${fecha.getFullYear()}-` + `${String(fecha.getMonth() + 1).padStart(2, '0')}-` + `${String(fecha.getDate()).padStart(2, '0')}`;
            resultado.push({
                fecha: key,
                venta: ventas.get(key) ?? 0
            });
        }

        return resultado;
    }

    private calcularPedidosRecientes(pedidos: Pedido[]): PedidoDashboard[] {
        return [...pedidos]
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .slice(0, 5)
            .map((p) => ({
                id: p.id,
                fecha: p.fecha,
                farmaciaNombre: p.farmaciaNombre,
                vendedorNombre: p.vendedorNombre,
                estado: p.estado,
                total: p.total
            }));
    }

    private fechaHoy(): string {
        return this.formatearFecha(new Date());
    }

    private fechaHace30Dias(): string {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 29);
        return this.formatearFecha(fecha);
    }

    private formatearFecha(fecha: Date): string {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
