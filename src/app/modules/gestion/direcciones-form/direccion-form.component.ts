// src/app/modules/gestion/direccion-form/direccion-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from '../../../shared/interfaces/address.interface';
import { AddressService } from '../../../shared/services/address.service';

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html'
})
export class DireccionFormComponent implements OnInit {
  direccionForm: FormGroup;
  isEdit = false;
  direccionId: number | null = null;
  loading = false;

  // Quitamos país ya que el backend no lo usa en create
  estados = ['Antioquia', 'Bogotá D.C.', 'Valle del Cauca', 'Cundinamarca', 'Santander', 'Atlántico', 'Bolívar'];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.direccionForm = this.fb.group({
      order_id: [null],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]], // ← Cambiado
      additional_info: ['']
      // Quitamos country ya que el backend no lo espera
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.direccionId = +params['id'];
        this.loadDireccion();
      }
    });
  }

  loadDireccion(): void {
    if (this.direccionId) {
      this.loading = true;
      this.addressService.getById(this.direccionId).subscribe({
        next: (direccion) => {
          this.direccionForm.patchValue(direccion);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
          alert('Error al cargar la dirección');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.direccionForm.valid) {
      this.loading = true;
      const direccionData: Address = this.direccionForm.value;

      const operation = this.isEdit && this.direccionId
        ? this.addressService.update(this.direccionId, direccionData)
        : this.addressService.create(direccionData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Dirección ${this.isEdit ? 'actualizada' : 'creada'} correctamente`);
          this.router.navigate(['/gestion/direcciones']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} la dirección`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/direcciones']);
  }
}