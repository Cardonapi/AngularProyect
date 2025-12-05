// src/app/modules/gestion/moto-form/moto-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Motorcycle } from '../../../shared/interfaces/motorcycle.interface';
import { MotorcycleService } from '../../../shared/services/motorcycle.service';

@Component({
  selector: 'app-moto-form',
  templateUrl: './moto-form.component.html'
})
export class MotoFormComponent implements OnInit {
  motoForm: FormGroup;
  isEdit = false;
  motoId: number | null = null;
  loading = false;
  currentYear: number;

  // Opciones para los selects
  marcas = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Bajaj', 'TVS', 'KTM', 'Ducati', 'Harley-Davidson', 'BMW', 'Otro'];
  
  // Estados según el backend: status=data.get('status', 'available')
  estados = [
    { value: 'available', label: 'Disponible' },
    { value: 'in_use', label: 'En uso' },
    { value: 'maintenance', label: 'En Mantenimiento' },
    { value: 'unavailable', label: 'No disponible' }
  ];

  constructor(
    private fb: FormBuilder,
    private motorcycleService: MotorcycleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentYear = new Date().getFullYear();
    
    // SOLO los campos que espera el backend según el código Python
    this.motoForm = this.fb.group({
      license_plate: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Z0-9\- ]+$/i) // Letras, números, guiones y espacios
      ]],
      brand: ['', Validators.required],
      year: [this.currentYear, [
        Validators.required, 
        Validators.min(2000), 
        Validators.max(this.currentYear)
      ]],
      status: ['available', Validators.required]
      
      // NOTA: El backend SOLO espera estos 4 campos según:
      // license_plate=data.get('license_plate')
      // brand=data.get('brand')
      // year=data.get('year')
      // status=data.get('status', 'available')
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.motoId = +params['id'];
        this.loadMoto();
      }
    });
  }

  loadMoto(): void {
    if (this.motoId) {
      this.loading = true;
      this.motorcycleService.getById(this.motoId).subscribe({
        next: (moto: Motorcycle) => {
          console.log('📥 Moto cargada:', moto);
          
          // Mapear los datos del backend al formulario
          // El backend devuelve 'license_plate' 
          const formData = {
            license_plate: moto.license_plate || '',
            brand: moto.brand || '',
            year: moto.year || this.currentYear,
            status: moto.status || 'available'
          };
          
          this.motoForm.patchValue(formData);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar la moto:', error);
          alert('Error al cargar la información de la moto');
          this.loading = false;
          this.router.navigate(['/gestion/motos']);
        }
      });
    }
  }

  onSubmit(): void {
    console.log('📤 Enviando formulario de moto...');
    console.log('📋 Valores del formulario:', this.motoForm.value);
    
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched(this.motoForm);
    
    if (this.motoForm.valid) {
      this.loading = true;
      
      // Preparar datos EXACTAMENTE como los espera el backend
      const motoData: Motorcycle = {
        id: 0, // Se asignará en el backend para creación
        license_plate: this.motoForm.get('license_plate')?.value?.trim().toUpperCase(),
        brand: this.motoForm.get('brand')?.value,
        year: Number(this.motoForm.get('year')?.value),
        status: this.motoForm.get('status')?.value
        
        // El backend SOLO espera estos 4 campos
      };
      
      console.log('🚀 Datos a enviar al backend:', motoData);
      
      const operation = this.isEdit && this.motoId
        ? this.motorcycleService.update(this.motoId, motoData)
        : this.motorcycleService.create(motoData);

      operation.subscribe({
        next: (response) => {
          console.log('✅ Operación exitosa:', response);
          this.loading = false;
          
          const message = this.isEdit 
            ? 'Moto actualizada correctamente' 
            : 'Moto creada correctamente';
          alert(message);
          
          this.router.navigate(['/gestion/motos']);
        },
        error: (error) => {
          console.error('❌ Error en la operación:', error);
          this.loading = false;
          
          let errorMessage = `Error al ${this.isEdit ? 'actualizar' : 'crear'} la moto`;
          
          if (error.status === 400 && error.error) {
            if (typeof error.error === 'object') {
              const errors = Object.values(error.error).flat();
              errorMessage += `:\n• ${errors.join('\n• ')}`;
            } else if (typeof error.error === 'string') {
              errorMessage += `: ${error.error}`;
            }
          } else if (error.message) {
            errorMessage += `: ${error.message}`;
          }
          
          alert(errorMessage);
        }
      });
    } else {
      console.warn('⚠️ Formulario inválido. Errores:', this.getFormErrors());
      alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  /**
   * Marcar todos los campos del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Obtener errores del formulario para debug
   */
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.motoForm.controls).forEach(key => {
      const control = this.motoForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  goBack(): void {
    this.router.navigate(['/gestion/motos']);
  }

  // Getters para el template
  get license_plate() { return this.motoForm.get('license_plate'); }
  get brand() { return this.motoForm.get('brand'); }
  get year() { return this.motoForm.get('year'); }
  get status() { return this.motoForm.get('status'); }
}