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
  currentYear: number; // ← Nueva propiedad

  // Opciones para los selects
  marcas = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Bajaj', 'TVS', 'KTM', 'Ducati'];
  colores = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Amarillo', 'Gris', 'Naranja'];
  estados = [
    { value: 'active', label: 'Activa' },
    { value: 'maintenance', label: 'En Mantenimiento' },
    { value: 'inactive', label: 'Inactiva' }
  ];

  constructor(
    private fb: FormBuilder,
    private motorcycleService: MotorcycleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentYear = new Date().getFullYear(); // ← Calcula aquí
    this.motoForm = this.fb.group({
      license_plate: ['', [Validators.required, Validators.minLength(6)]],
      brand: ['', Validators.required],
      model: ['', [Validators.required, Validators.minLength(2)]],
      year: [this.currentYear, [Validators.required, Validators.min(2000), Validators.max(this.currentYear)]],
      color: ['', Validators.required],
      status: ['active', Validators.required]
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
      this.motorcycleService.getById(this.motoId).subscribe({
        next: (moto) => {
          this.motoForm.patchValue(moto);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar la moto');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.motoForm.valid) {
      this.loading = true;
      const motoData = this.motoForm.value;

      const operation = this.isEdit && this.motoId
        ? this.motorcycleService.update(this.motoId, motoData)
        : this.motorcycleService.create(motoData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Moto ${this.isEdit ? 'actualizada' : 'creada'} correctamente`);
          this.router.navigate(['/gestion/motos']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} la moto`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/motos']);
  }
}
