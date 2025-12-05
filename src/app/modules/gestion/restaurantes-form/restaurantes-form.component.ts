// src/app/modules/gestion/restaurantes-form/restaurantes-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurante } from '../../../shared/interfaces/restaurante.interface';
import { RestauranteService } from '../../../shared/services/restaurante.service';

@Component({
  selector: 'app-restaurantes-form',
  templateUrl: './restaurantes-form.component.html'
})
export class RestaurantesFormComponent implements OnInit {
  restauranteForm: FormGroup;
  isEdit = false;
  restauranteId: number | null = null;
  loading = false;
  restauranteName: string = '';

  constructor(
    private fb: FormBuilder,
    private restauranteService: RestauranteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.restauranteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.restauranteId = +params['id'];
        this.loadRestaurante();
      }
    });
  }

  loadRestaurante(): void {
    if (this.restauranteId) {
      this.loading = true;
      this.restauranteService.getById(this.restauranteId).subscribe({
        next: (restaurante) => {
          this.restauranteForm.patchValue(restaurante);
          this.restauranteName = restaurante.name;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.showAlert('Error al cargar el restaurante', 'error');
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
    const message = `¿Eliminar el restaurante "${this.restauranteName}"?`;
    
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
    
    setTimeout(() => {
      const confirmBtn = document.getElementById('confirmDeleteBtn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => this.deleteRestaurante());
      }
    }, 100);
  }

  // ✅ ELIMINAR RESTAURANTE
  deleteRestaurante(): void {
    if (!this.restauranteId) return;
    
    const modal = document.querySelector('.modal-container');
    if (modal) modal.remove();
    
    this.loading = true;
    
    this.restauranteService.delete(this.restauranteId).subscribe({
      next: () => {
        this.loading = false;
        this.showAlert('✅ Restaurante eliminado correctamente', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/gestion/restaurantes']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error:', error);
        this.showAlert('❌ Error al eliminar el restaurante', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.restauranteForm.valid) {
      this.loading = true;
      const restauranteData = this.restauranteForm.value;

      const operation = this.isEdit && this.restauranteId
        ? this.restauranteService.update(this.restauranteId, restauranteData)
        : this.restauranteService.create(restauranteData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          
          if (this.isEdit) {
            this.showAlert('✅ Restaurante actualizado correctamente', 'success');
          } else {
            this.showAlert('✅ Restaurante creado exitosamente', 'success');
          }
          
          setTimeout(() => {
            this.router.navigate(['/gestion/restaurantes']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          
          if (this.isEdit) {
            this.showAlert('❌ Error al actualizar el restaurante', 'error');
          } else {
            this.showAlert('❌ Error al crear el restaurante', 'error');
          }
        }
      });
    } else {
      Object.keys(this.restauranteForm.controls).forEach(key => {
        this.restauranteForm.get(key)?.markAsTouched();
      });
      this.showAlert('Por favor complete todos los campos correctamente', 'warning');
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/restaurantes']);
  }
}