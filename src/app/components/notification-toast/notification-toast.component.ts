import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-toast',
  template: `
    <div class="notification-toast" [class]="'notification-' + type" [@slideIn]>
      <div class="notification-content">
        <div class="notification-header">
          <h4 class="notification-title">{{ title }}</h4>
          <button class="notification-close" (click)="onClose()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="notification-message">{{ message }}</p>
        <div class="notification-progress" *ngIf="duration && duration > 0">
          <div class="progress-bar" [style.width.%]="progressPercent"></div>
        </div>
      </div>
      <div class="notification-icon">
        <i [class]="iconClass"></i>
      </div>
    </div>
  `,
  styleUrls: ['./notification-toast.component.css']
})
export class NotificationToastComponent implements OnInit {
  @Input() type: 'success' | 'error' | 'warning' | 'info' | 'order' = 'info';
  @Input() title: string = 'Notificación';
  @Input() message: string = '';
  @Input() duration: number = 5000;
  @Output() close = new EventEmitter<void>();

  progressPercent = 100;
  iconClass = 'fas fa-info-circle';

  ngOnInit(): void {
    this.setIconByType();
    this.animateProgress();
  }

  private setIconByType(): void {
    const icons: { [key: string]: string } = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
      order: 'fas fa-shopping-cart'
    };
    this.iconClass = icons[this.type] || 'fas fa-info-circle';
  }

  private animateProgress(): void {
    if (this.duration && this.duration > 0) {
      const interval = 30; // ms entre actualizaciones
      const decrement = (interval / this.duration) * 100;
      const timer = setInterval(() => {
        this.progressPercent -= decrement;
        if (this.progressPercent <= 0) {
          clearInterval(timer);
          this.onClose();
        }
      }, interval);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
