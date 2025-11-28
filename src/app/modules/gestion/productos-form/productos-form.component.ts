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
      this.productoService.getById(this.productoId).subscribe({
        next: (producto) => {
          this.productoForm.patchValue(producto);
        },
        error: (error) => {
          console.error('Error:', error);
          this.showBasicAlert('Error al cargar el producto', 'error');
        }
      });
    }
  }

  // ✅ ALERTA BÁSICA MEJORADA
  showBasicAlert(message: string, type: 'success' | 'error' = 'success') {
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
    
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 4000);

    alertDiv.querySelector('.close')?.addEventListener('click', () => {
      alertDiv.remove();
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
            this.showBasicAlert('✅ Producto actualizado correctamente', 'success');
          } else {
            this.showBasicAlert('✅ Producto creado exitosamente', 'success');
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
            this.showBasicAlert('❌ Error al actualizar el producto', 'error');
          } else {
            this.showBasicAlert('❌ Error al crear el producto', 'error');
          }
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/productos']);
  }
}