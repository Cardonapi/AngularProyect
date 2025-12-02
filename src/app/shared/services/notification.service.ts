import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private audio = new Audio('assets/sounds/alert.mp3');
  private notifications$ = new Subject<string>();

  constructor(private toastr: ToastrService) {
    this.audio.volume = 1.0;
  }

  // 🔔 Mostrar alerta visual
  notify(message: string) {
    this.toastr.success(message, 'Nuevo Pedido');
    this.playSound();
    this.notifications$.next(message);
  }

  // 🔊 Reproducir sonido
  private playSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch(err => console.warn("Audio blocked:", err));
  }

  // Para que el ícono del menú sepa si hay nuevas notificaciones
  onNotification() {
    return this.notifications$.asObservable();
  }
}

