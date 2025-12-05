import { Component, AfterViewInit, NgZone, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { MapService } from '../../shared/services/map.service';
import { OrderSocketService } from '../../shared/services/order-socket.service';
import { environment } from '../../../environments/environment';
import { OrderSocketIoService } from '../../shared/services/order-socket-io.service';

@Component({
  selector: 'app-order-map',
  templateUrl: './order-map.component.html',
  styleUrls: ['./order-map.component.scss']
})
export class OrderMapComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: { [key: string]: L.Marker } = {};
  private firstCentered = false;
  private motoDivIcon!: L.DivIcon;
  @Input() plate: string = 'ABC124';

  constructor(
    private svc: MapService,
    private zone: NgZone,
    private socket: OrderSocketService,
    private sio: OrderSocketIoService,
    private http: HttpClient,
  ) {}

  ngAfterViewInit(): void {
    // Inicializa fuera de Angular para mejor rendimiento y espera a que el DOM esté listo
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.createMapProperly();
      }, 300);
    });
  }

  private createMapProperly() {
    const el = document.getElementById('orders-map');
    if (!el) return;

    this.initMap();

    // Ajustar tamaño real del mapa
    setTimeout(() => this.map.invalidateSize(true), 300);
    window.addEventListener('resize', () => this.map.invalidateSize(true));

    // 1) Preferir Socket.IO si environment.apiUrl existe (backend del profe usa Flask-SocketIO)
    if (environment.apiUrl) {
      this.sio.connect();
      this.sio.listenToPlate(this.plate).subscribe(coord => {
        this.addOrMoveMarker(coord, this.plate);
      });
      return;
    }

    // 2) Si no hay Socket.IO, usar WebSocket puro si wsUrl está configurado
    if (environment['wsUrl']) {
      this.socket.connect('/orders');
      this.socket.updates$.subscribe(update => {
        if (Array.isArray(update)) {
          update.forEach(o => this.addOrMoveMarker(o));
        } else {
          this.addOrMoveMarker(update);
        }
      });
      this.svc.getActiveOrders().subscribe(orders => {
        orders.forEach(o => this.addOrMoveMarker(o));
      });
      return;
    }

    // 3) Fallback final a polling HTTP
    this.svc.getActiveOrders().subscribe({
      next: (orders) => orders.forEach(o => this.addOrMoveMarker(o)),
      error: () => { /* ignora si no hay servidor de polling */ }
    });
    this.svc.ordersUpdates().subscribe({
      next: (orders) => orders.forEach(o => this.addOrMoveMarker(o)),
      error: () => { /* ignora si no hay servidor de polling */ }
    });
  }

  private initMap(): void {
    if (this.map) return;
    // Usar emoji de motocicleta 🏍️ en un DivIcon
    const html = `<div style="font-size: 32px; line-height: 1; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">🏍️</div>`;
    this.motoDivIcon = L.divIcon({
      html: html,
      className: 'moto-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.map = L.map('orders-map', {
      center: [4.6, -74.08],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }

  private addOrMoveMarker(o: any, key?: string): void {
    if (!o || o.lat == null || o.lng == null) return;
    const markerKey = key ?? String(o.id ?? 'default');

    if (!this.markers[markerKey]) {
      this.markers[markerKey] = L.marker([o.lat, o.lng], { icon: this.motoDivIcon }).addTo(this.map);
      if (!this.firstCentered) {
        try {
          this.map.setView([o.lat, o.lng], 15, { animate: true });
        } catch {}
        this.firstCentered = true;
      }
    } else {
      this.markers[markerKey].setLatLng([o.lat, o.lng]);
    }
  }

  // --- UI Actions: start/stop tracking without console ---
  startTracking(): void {
    const url = `${environment.apiUrl}/motorcycles/track/${this.plate}`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log('[TRACK] start ok', res),
      error: (err) => console.warn('[TRACK] start error', err)
    });
  }

  stopTracking(): void {
    const url = `${environment.apiUrl}/motorcycles/stop/${this.plate}`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log('[TRACK] stop ok', res),
      error: (err) => console.warn('[TRACK] stop error', err)
    });
  }
}
