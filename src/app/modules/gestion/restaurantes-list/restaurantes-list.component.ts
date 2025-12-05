// src/app/modules/gestion/restaurantes-list/restaurantes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurante } from '../../../shared/interfaces/restaurante.interface';
import { RestauranteService } from '../../../shared/services/restaurante.service';

@Component({
  selector: 'app-restaurantes-list',
  templateUrl: './restaurantes-list.component.html'
})
export class RestaurantesListComponent implements OnInit {
  restaurantes: Restaurante[] = [];
  loading = true;

  constructor(
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurantes();
  }

  loadRestaurantes(): void {
    this.loading = true;
    this.restauranteService.getAll().subscribe({
      next: (data) => {
        this.restaurantes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        this.showAlert('Error al cargar los restaurantes', 'error');
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

  editRestaurante(id: number): void {
    this.router.navigate(['/gestion/restaurantes/editar', id]);
  }

  createRestaurante(): void {
    this.router.navigate(['/gestion/restaurantes/nuevo']);
  }

  // ✅ ELIMINAR CON MODAL
  deleteRestaurante(id: number): void {
    const restaurante = this.restaurantes.find(r => r.id === id);
    const message = `¿Eliminar el restaurante "${restaurante?.name || 'este restaurante'}"?`;
    
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
        confirmBtn.addEventListener('click', () => {
          modalDiv.remove();
          
          this.restauranteService.delete(id).subscribe({
            next: () => {
              this.showAlert('✅ Restaurante eliminado correctamente', 'success');
              this.restaurantes = this.restaurantes.filter(r => r.id !== id);
            },
            error: (error) => {
              console.error('Error:', error);
              this.showAlert('❌ Error al eliminar el restaurante', 'error');
            }
          });
        });
      }
    }, 100);
  }
}