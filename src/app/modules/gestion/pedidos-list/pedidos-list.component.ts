// src/app/modules/gestion/pedidos-list/pedidos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../../shared/interfaces/order.interface';
import { OrderService } from '../../../shared/services/order.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pedidos-list',
  templateUrl: './pedidos-list.component.html'
})
export class PedidosListComponent implements OnInit {
  pedidos: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.loading = false;
        console.log('Pedidos cargados:', data);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los pedidos');
      }
    });
  }

  editPedido(id: number): void {
    this.router.navigate(['/gestion/pedidos/editar', id]);
  }

  createPedido(): void {
    this.router.navigate(['/gestion/pedidos/nuevo']);
  }

  deletePedido(id: number): void {
    const pedido = this.pedidos.find(p => p.id === id);
    
    if (confirm(`¿Estás seguro de eliminar el pedido #${pedido?.id}?`)) {
      this.orderService.delete(id).subscribe({
        next: () => {
          alert('✅ Pedido eliminado correctamente');
          this.pedidos = this.pedidos.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('❌ Error al eliminar el pedido');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'in_progress': return 'bg-info';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  // 🏍️ Métodos de tracking
  startTracking(): void {
    const plate = 'ABC124';
    const url = `${environment.apiUrl}/motorcycles/track/${plate}`;
    this.http.post(url, {}).subscribe({
      next: (res) => {
        console.log('[TRACK] start ok', res);
        alert('✅ Rastreo iniciado');
      },
      error: (err) => {
        console.warn('[TRACK] start error', err);
        alert('⚠️ Error al iniciar rastreo');
      }
    });
  }

  stopTracking(): void {
    const plate = 'ABC124';
    const url = `${environment.apiUrl}/motorcycles/stop/${plate}`;
    this.http.post(url, {}).subscribe({
      next: (res) => {
        console.log('[TRACK] stop ok', res);
        alert('✅ Rastreo detenido');
      },
      error: (err) => {
        console.warn('[TRACK] stop error', err);
        alert('⚠️ Error al detener rastreo');
      }
    });
  }
}