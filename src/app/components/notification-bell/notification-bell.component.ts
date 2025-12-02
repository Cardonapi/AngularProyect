import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit {

  unread = 0;

  constructor(private notif: NotificationService) {}

  ngOnInit(): void {
    this.notif.onNotification().subscribe(() => {
      this.unread++;
    });
  }

  clear() {
    this.unread = 0;
  }
}
