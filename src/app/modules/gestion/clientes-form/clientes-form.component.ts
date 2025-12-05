// src/app/modules/gestion/clientes-form/clientes-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../shared/interfaces/cliente.interface';
import { ClienteService } from '../../../shared/services/cliente.service';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html'
})
export class ClientesFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEdit = false;
  clienteId: number | null = null;
  loading = false;
  clienteName: string = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // SOLO los campos que espera el backend: name, email, phone
    this.clienteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]{7,15}$/)]]
      // NO incluir 'address' porque el backend no lo espera
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.clienteId = +params['id'];
        this.loadCliente();
      }
    });
  }

  loadCliente(): void {
    if (this.clienteId) {
      this.loading = true;
      this.clienteService.getById(this.clienteId).subscribe({
        next: (cliente) => {
          this.clienteForm.patchValue({
            name: cliente.name || '',
            email: cliente.email || '',
            phone: cliente.phone || ''
          });
          this.clienteName = cliente.name;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.showAlert('Error al cargar el cliente', 'error');
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
    const message = `¿Eliminar al cliente "${this.clienteName}"?`;
    
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
        confirmBtn.addEventListener('click', () => this.deleteCliente());
      }
    }, 100);
  }

  // ✅ ELIMINAR CLIENTE
  deleteCliente(): void {
    if (!this.clienteId) return;
    
    const modal = document.querySelector('.modal-container');
    if (modal) modal.remove();
    
    this.loading = true;
    
    this.clienteService.delete(this.clienteId).subscribe({
      next: () => {
        this.loading = false;
        this.showAlert('✅ Cliente eliminado correctamente', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/gestion/clientes']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error:', error);
        this.showAlert('❌ Error al eliminar el cliente', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.loading = true;
      const clienteData = this.clienteForm.value;

      const operation = this.isEdit && this.clienteId
        ? this.clienteService.update(this.clienteId, clienteData)
        : this.clienteService.create(clienteData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          
          if (this.isEdit) {
            this.showAlert('✅ Cliente actualizado correctamente', 'success');
          } else {
            this.showAlert('✅ Cliente creado exitosamente', 'success');
          }
          
          setTimeout(() => {
            this.router.navigate(['/gestion/clientes']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          
          if (this.isEdit) {
            this.showAlert('❌ Error al actualizar el cliente', 'error');
          } else {
            this.showAlert('❌ Error al crear el cliente', 'error');
          }
        }
      });
    } else {
      Object.keys(this.clienteForm.controls).forEach(key => {
        this.clienteForm.get(key)?.markAsTouched();
      });
      this.showAlert('Por favor complete todos los campos correctamente', 'warning');
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/clientes']);
  }
}