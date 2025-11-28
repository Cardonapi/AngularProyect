// src/app/modules/gestion/productos-list/productos-list.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductoService } from '../../../shared/services/producto.service';

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html'
})
export class ProductosListComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.loading = true;
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
        console.log('Productos cargados:', data);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        this.showBasicAlert('Error al cargar los productos', 'error');
      }
    });
  }

  // ✅ ALERTAS BÁSICAS MEJORADAS
  showBasicAlert(message: string, type: 'success' | 'error' = 'success') {
    // Buscar si ya existe una alerta
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? '✅' : '❌';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show custom-alert position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
      <strong>${icon} ${type === 'success' ? 'Éxito' : 'Error'}</strong> ${message}
      <button type="button" class="close" data-dismiss="alert">
        <span>&times;</span>
      </button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 4000);

    // Add dismiss functionality
    alertDiv.querySelector('.close')?.addEventListener('click', () => {
      alertDiv.remove();
    });
  }

  editProducto(id: number): void {
    this.router.navigate(['/gestion/productos/editar', id]);
  }

  createProducto(): void {
    this.router.navigate(['/gestion/productos/nuevo']);
  }

  // ✅ ELIMINAR CON MODAL
  deleteProducto(id: number): void {
    const producto = this.productos.find(p => p.id === id);
    
    const modalRef = this.modalService.open(NgbdModalConfirm);
    modalRef.componentInstance.message = `¿Eliminar el producto "${producto?.name}"?`;
    
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.productoService.delete(id).subscribe({
          next: () => {
            this.showBasicAlert('Producto eliminado correctamente', 'success');
            this.productos = this.productos.filter(p => p.id !== id);
          },
          error: (error) => {
            console.error('Error:', error);
            this.showBasicAlert('Error al eliminar el producto', 'error');
          }
        });
      }
    }).catch(() => {
      // Cancelado - no hacer nada
    });
  }
}

// ✅ MODAL DE CONFIRMACIÓN
@Component({
  selector: 'ngbd-modal-confirm',
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
export class NgbdModalConfirm {
  @Input() message: string = '¿Estás seguro?';

  constructor(public activeModal: NgbActiveModal) {}
}