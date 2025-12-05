import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'order';
  title: string;
  message: string;
  duration?: number;
  showSound?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private audio = new Audio('assets/sounds/alert.mp3');
  private notifications: Notification[] = [];
  public notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationStream$ = this.notifications$.asObservable();

  constructor(private toastr: ToastrService) {
    this.audio.volume = 1.0;
  }

  // 🔔 Mostrar notificación personalizada con toast custom
  showNotification(notification: Notification): void {
    // Genera un ID único si no lo tiene
    if (!notification.id) {
      notification.id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Agrega la notificación al arreglo
    this.notifications.push(notification);
    this.notifications$.next([...this.notifications]);

    // Reproduce sonido si está configurado
    if (notification.showSound !== false) {
      this.playSound();
    }

    // Auto-elimina la notificación después del tiempo especificado
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  // 🔔 Mostrar alerta de nuevo pedido (atajos)
  orderAlert(title: string, message: string): void {
    this.showNotification({
      id: '',
      type: 'order',
      title,
      message,
      duration: 8000,
      showSound: true
    });
  }

  // 🔔 Mostrar alerta de éxito
  success(title: string, message: string): void {
    this.showNotification({
      id: '',
      type: 'success',
      title,
      message,
      duration: 5000,
      showSound: false
    });
  }

  // 🔔 Mostrar alerta de error
  error(title: string, message: string): void {
    this.showNotification({
      id: '',
      type: 'error',
      title,
      message,
      duration: 6000,
      showSound: false
    });
  }

  // 🔔 Mostrar alerta de advertencia
  warning(title: string, message: string): void {
    this.showNotification({
      id: '',
      type: 'warning',
      title,
      message,
      duration: 5000,
      showSound: false
    });
  }

  // 🔔 Mostrar alerta informativa
  info(title: string, message: string): void {
    this.showNotification({
      id: '',
      type: 'info',
      title,
      message,
      duration: 5000,
      showSound: false
    });
  }

  // 🔊 Reproducir sonido
  private playSound(): void {
    this.audio.currentTime = 0;
    this.audio.play().catch(err => console.warn("Audio blocked:", err));
  }

  // ❌ Eliminar notificación por ID
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifications$.next([...this.notifications]);
  }

  // 🔔 Limpiar todas las notificaciones
  clearAll(): void {
    this.notifications = [];
    this.notifications$.next([]);
  }

  // Para que el ícono del menú sepa si hay nuevas notificaciones (compatibilidad)
  onNotification() {
    return this.notificationStream$;
  }

  // Método legacy para compatibilidad con código anterior
  notify(message: string) {
    this.toastr.success(message, 'Nuevo Pedido');
    this.playSound();
  }
}

