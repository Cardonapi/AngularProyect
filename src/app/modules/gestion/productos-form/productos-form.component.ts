// src/app/modules/gestion/productos-form/productos-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductoService } from '../../../shared/services/producto.service';

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html'
})
export class ProductosFormComponent implements OnInit {
  productoForm: FormGroup;
  isEdit = false;
  productoId: number | null = null;
  loading = false;
  productoName: string = '';

  // Categorías predefinidas para el select
  categorias = [
    'Comida',
    'Bebida', 
    'Postre',
    'Acompañamiento',
    'Especial'
  ];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.productoId = +params['id'];
        this.loadProducto();
      }
    });
  }

  loadProducto(): void {
    if (this.productoId) {
      this.loading = true;
      this.productoService.getById(this.productoId).subscribe({
        next: (producto) => {
          this.productoForm.patchValue(producto);
          this.productoName = producto.name;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.showAlert('Error al cargar el producto', 'error');
          this.loading = false;
        }
      });
    }
  }

  // ✅ ALERTAS
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

  // ✅ CONFIRMACIÓN DE ELIMINACIÓN
  showDeleteConfirmation(): void {
    const message = `¿Eliminar el producto "${this.productoName}"?`;
    
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
        confirmBtn.addEventListener('click', () => this.deleteProducto());
      }
    }, 100);
  }

  // ✅ ELIMINAR PRODUCTO
  deleteProducto(): void {
    if (!this.productoId) return;
    
    // Remover modal
    const modal = document.querySelector('.modal-container');
    if (modal) modal.remove();
    
    this.loading = true;
    
    this.productoService.delete(this.productoId).subscribe({
      next: () => {
        this.loading = false;
        this.showAlert('✅ Producto eliminado correctamente', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/gestion/productos']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error:', error);
        this.showAlert('❌ Error al eliminar el producto', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      this.loading = true;
      const productoData = this.productoForm.value;

      // Asegurar que el precio sea número
      productoData.price = parseFloat(productoData.price);

      const operation = this.isEdit && this.productoId
        ? this.productoService.update(this.productoId, productoData)
        : this.productoService.create(productoData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          
          if (this.isEdit) {
            this.showAlert('✅ Producto actualizado correctamente', 'success');
          } else {
            this.showAlert('✅ Producto creado exitosamente', 'success');
          }
          
          // Navegar después de 2 segundos para ver la alerta
          setTimeout(() => {
            this.router.navigate(['/gestion/productos']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          
          if (this.isEdit) {
            this.showAlert('❌ Error al actualizar el producto', 'error');
          } else {
            this.showAlert('❌ Error al crear el producto', 'error');
          }
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
      this.showAlert('Por favor complete todos los campos correctamente', 'warning');
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/productos']);
  }
}