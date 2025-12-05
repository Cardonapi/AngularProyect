import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../shared/services/notification.service';

@Component({
  selector: 'app-notification-container',
  template: `
    <div class="notification-container">
      <app-notification-toast
        *ngFor="let notification of notifications"
        [type]="notification.type"
        [title]="notification.title"
        [message]="notification.message"
        [duration]="notification.duration || 5000"
        (close)="onNotificationClose(notification.id)"
      ></app-notification-toast>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      max-width: 500px;
      pointer-events: none;
    }

    .notification-container app-notification-toast {
      pointer-events: auto;
      display: block;
    }

    @media (max-width: 640px) {
      .notification-container {
        top: 70px;
        right: 10px;
        left: 10px;
        max-width: 100%;
      }
    }
  `]
})
export class NotificationContainerComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
    });
  }

  onNotificationClose(id: string): void {
    this.notificationService.removeNotification(id);
  }
}

