// src/app/modules/gestion/productos-list/productos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductoService } from '../../../shared/services/producto.service';

// Componente del modal
@Component({
  selector: 'app-confirm-delete-modal',
  template: `
    <div class="modal-header">
      <h5 class="modal-title text-danger">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        Confirmar Eliminación
      </h5>
      <button type="button" class="close" (click)="close()">
        <span>&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="mb-2">{{message}}</p>
      <small class="text-muted">Esta acción no se puede deshacer.</small>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="close()">
        <i class="fas fa-times mr-1"></i> Cancelar
      </button>
      <button type="button" class="btn btn-danger" (click)="confirm()">
        <i class="fas fa-trash mr-1"></i> Eliminar
      </button>
    </div>
  `
})
export class ConfirmDeleteModalComponent {
  message: string = '¿Estás seguro?';
  
  constructor(
    private activeModal: NgbActiveModal
  ) {}

  close() {
    this.activeModal.dismiss('cancel');
  }

  confirm() {
    this.activeModal.close('confirm');
  }
}

// Componente principal del list
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
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        this.showAlert('Error al cargar los productos', 'error');
      }
    });
  }

  // ✅ ALERTAS MEJORADAS
  showAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();

    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 'alert-warning';
    const icon = type === 'success' ? '✅' : 
                type === 'error' ? '❌' : '⚠️';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show custom-alert position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
      <strong>${icon} ${type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : 'Advertencia'}</strong> ${message}
      <button type="button" class="close" onclick="this.parentElement.remove()">
        <span>&times;</span>
      </button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      if (alertDiv.parentNode) alertDiv.parentNode.removeChild(alertDiv);
    }, 4000);
  }

  editProducto(id: number): void {
    this.router.navigate(['/gestion/productos/editar', id]);
  }

  createProducto(): void {
    this.router.navigate(['/gestion/productos/nuevo']);
  }

  // ✅ ELIMINAR CON MODAL SIMPLIFICADO
  deleteProducto(id: number): void {
    const producto = this.productos.find(p => p.id === id);
    const message = `¿Eliminar el producto "${producto?.name || 'este producto'}"?`;
    
    // Crear modal manualmente (sin NgbModal si da problemas)
    const modalHtml = `
      <div class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Confirmar Eliminación
              </h5>
              <button type="button" class="close" onclick="this.closest('.modal').remove()">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p class="mb-2">${message}</p>
              <small class="text-muted">Esta acción no se puede deshacer.</small>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times mr-1"></i> Cancelar
              </button>
              <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                <i class="fas fa-trash mr-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHtml;
    modalDiv.className = 'modal-container';
    document.body.appendChild(modalDiv);
    
    // Agregar evento al botón de confirmación
    setTimeout(() => {
      const confirmBtn = document.getElementById('confirmDeleteBtn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          // Remover modal
          modalDiv.remove();
          
          // Eliminar producto
          this.productoService.delete(id).subscribe({
            next: () => {
              this.showAlert('✅ Producto eliminado correctamente', 'success');
              this.productos = this.productos.filter(p => p.id !== id);
            },
            error: (error) => {
              console.error('Error:', error);
              this.showAlert('❌ Error al eliminar el producto', 'error');
            }
          });
        });
      }
    }, 100);
  }
}