// src/app/components/confirmation-modal/confirmation-modal.component.ts
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  template: `
    <div class="modal-header">
      <h5 class="modal-title text-danger">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        Confirmar Eliminación
      </h5>
      <button type="button" class="close" (click)="activeModal.dismiss()">
        <span>&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="mb-2">{{message}}</p>
      <small class="text-muted">Esta acción no se puede deshacer.</small>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        <i class="fas fa-times mr-1"></i> Cancelar
      </button>
      <button type="button" class="btn btn-danger" (click)="activeModal.close('confirm')">
        <i class="fas fa-trash mr-1"></i> Eliminar
      </button>
    </div>
  `
})
export class ConfirmationModalComponent {
  @Input() message: string = '¿Estás seguro?';

  constructor(public activeModal: NgbActiveModal) {}
}