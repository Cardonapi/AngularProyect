import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CoordUpdate { id?: number; lat: number; lng: number; status?: string }

@Injectable({ providedIn: 'root' })
export class OrderSocketIoService {
  private socket?: Socket;

  constructor(private zone: NgZone) {}

  connect(): void {
    if (this.socket && this.socket.connected) return;
    this.socket = io(environment.apiUrl, {
      path: '/socket.io',
      // Fuerza polling para evitar errores de WebSocket en servidores dev
      transports: ['polling'],
      rememberUpgrade: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      forceNew: true,
      autoConnect: true,
      withCredentials: false
    });
    this.socket.on('connect', () => console.log('[SIO] conectado', this.socket?.id));
    this.socket.on('connect_error', (err) => console.warn('[SIO] connect_error', err));
  }

  listenToPlate(plate: string): Observable<CoordUpdate> {
    const subj = new Subject<CoordUpdate>();
    if (!this.socket) this.connect();
    this.socket?.on(plate, (payload: CoordUpdate) => {
      console.log('[SIO] evento', plate, payload);
      this.zone.run(() => subj.next(payload));
    });
    return subj.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }
}
