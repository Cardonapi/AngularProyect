// src/app/modules/gestion/conductor-form/conductor-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from '../../../shared/interfaces/driver.interface';
import { DriverService } from '../../../shared/services/driver.service';

@Component({
  selector: 'app-conductor-form',
  templateUrl: './conductor-form.component.html'
})
export class ConductorFormComponent implements OnInit {
  conductorForm: FormGroup;
  isEdit = false;
  conductorId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.conductorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{7,20}$/)]],
      license_number: ['', [Validators.required, Validators.minLength(5)]],
      status: ['available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.conductorId = +params['id'];
        this.loadConductor();
      }
    });
  }

  loadConductor(): void {
    if (this.conductorId) {
      this.loading = true;
      this.driverService.getById(this.conductorId).subscribe({
        next: (conductor) => {
          this.conductorForm.patchValue(conductor);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
          alert('Error al cargar el conductor');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.conductorForm.valid) {
      this.loading = true;
      const conductorData: Driver = this.conductorForm.value;

      const operation = this.isEdit && this.conductorId
        ? this.driverService.update(this.conductorId, conductorData)
        : this.driverService.create(conductorData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Conductor ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/conductores']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el conductor`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/conductores']);
  }
}