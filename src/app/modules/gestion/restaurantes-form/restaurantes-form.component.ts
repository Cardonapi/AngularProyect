// src/app/modules/gestion/restaurantes-form/restaurantes-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurante } from '../../../shared/interfaces/restaurante.interface';
import { RestauranteService } from '../../../shared/services/restaurante.service';

@Component({
  selector: 'app-restaurantes-form',
  templateUrl: './restaurantes-form.component.html',
  styleUrls: ['./restaurantes-form.component.css']
})
export class RestaurantesFormComponent implements OnInit {
  restauranteForm: FormGroup;
  isEdit = false;
  restauranteId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private restauranteService: RestauranteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.restauranteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
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
      this.restauranteService.getById(this.restauranteId).subscribe({
        next: (restaurante) => {
          this.restauranteForm.patchValue(restaurante);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar el restaurante');
        }
      });
    }
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
          alert(`Restaurante ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/restaurantes']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el restaurante`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/restaurantes']);
  }
}