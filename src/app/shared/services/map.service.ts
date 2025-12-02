import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface Order {
  id: number;
  status: string;
  lat: number;
  lng: number;
  driverId?: number;
  assignedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MapService {
  // Ajusta la URL si tu json-server corre en otro puerto o si usas proxy
  private BASE = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // carga inicial de pedidos activos
  getActiveOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.BASE}/orders`);
  }

  // simulación/actualización periódica: polling cada 3s
  ordersUpdates(pollMs = 3000): Observable<Order[]> {
    return interval(pollMs).pipe(
      switchMap(() => this.http.get<Order[]>(`${this.BASE}/orders`))
    );
  }
}
