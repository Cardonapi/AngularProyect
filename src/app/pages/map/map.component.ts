import { Component, AfterViewInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../shared/services/map.service';

@Component({
  selector: 'app-map-page',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapPageComponent implements AfterViewInit {

  private map!: L.Map;
  private markers: { [id: number]: L.Marker } = {};

  constructor(private svc: MapService, private zone: NgZone) {}

  ngAfterViewInit(): void {
    // Espera a que el DOM + animaciones + estilos terminen
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.createMapProperly();
      }, 500); // ← EL TIEMPO MÁGICO
    });
  }

  private createMapProperly() {
    this.initMap();

    // Recalcular tamaño real del mapa
    setTimeout(() => this.map.invalidateSize(true), 300);

    // Mantenerlo correcto si cambia el tamaño
    window.addEventListener('resize', () => {
      this.map.invalidateSize(true);
    });

    // Cargar pedidos
    this.svc.getActiveOrders().subscribe(orders => {
      orders.forEach(o => this.addOrMoveMarker(o));
    });

    this.svc.ordersUpdates().subscribe(orders => {
      orders.forEach(o => this.addOrMoveMarker(o));
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [4.6, -74.08],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }

  private addOrMoveMarker(o: any): void {
    if (!this.markers[o.id]) {
      this.markers[o.id] = L.marker([o.lat, o.lng]).addTo(this.map);
    } else {
      this.markers[o.id].setLatLng([o.lat, o.lng]);
    }
  }
}
