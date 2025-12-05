import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';

// Formato básico esperado de un pedido para el mapa
export interface LiveOrder {
  id: number;
  lat: number;
  lng: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderSocketService {
  private socket?: WebSocket;
  private updatesSubject = new Subject<LiveOrder | LiveOrder[]>();
  public updates$ = this.updatesSubject.asObservable();

  constructor(private zone: NgZone) {}

  connect(path: string = '/orders'): void {
    if (!environment['wsUrl']) {
      // No hay WebSocket configurado
      return;
    }

    const url = environment.wsUrl.endsWith(path)
      ? environment.wsUrl
      : `${environment.wsUrl}${path}`;

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        // Conexión establecida
        // console.log('WS conectado:', url);
      };

      this.socket.onmessage = (event) => {
        // Asegurar cambio de zona de Angular para actualizar vistas si hace falta
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data);
            // Puede venir un solo pedido o un arreglo
            if (Array.isArray(data)) {
              this.updatesSubject.next(data as LiveOrder[]);
            } else {
              this.updatesSubject.next(data as LiveOrder);
            }
          } catch (e) {
            // Si no es JSON, ignorar o manejar según protocolo
            // console.warn('WS payload no-JSON:', event.data);
          }
        });
      };

      this.socket.onerror = () => {
        // console.error('WS error');
      };

      this.socket.onclose = () => {
        // console.log('WS cerrado');
      };
    } catch (e) {
      // console.error('WS exception:', e);
    }
  }

  close(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}
