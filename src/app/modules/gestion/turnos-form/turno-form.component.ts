// src/app/modules/gestion/turno-form/turno-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shift } from '../../../shared/interfaces/shift.interface';
import { ShiftService } from '../../../shared/services/shift.service';

@Component({
  selector: 'app-turno-form',
  templateUrl: './turno-form.component.html'
})
export class TurnoFormComponent implements OnInit {
  turnoForm: FormGroup;
  isEdit = false;
  turnoId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.turnoForm = this.fb.group({
      driver_id: [null, [Validators.required, Validators.min(1)]],
      motorcycle_id: [null, [Validators.required, Validators.min(1)]],
      start_time: ['', Validators.required],
      end_time: [''],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.turnoId = +params['id'];
        this.loadTurno();
      } else {
        // Si es nuevo, establecer hora actual por defecto
        const now = new Date().toISOString().slice(0, 16);
        this.turnoForm.patchValue({ start_time: now });
      }
    });
  }

  loadTurno(): void {
    if (this.turnoId) {
      this.loading = true;
      this.shiftService.getById(this.turnoId).subscribe({
        next: (turno) => {
          // Convertir fechas para el input datetime-local
          if (turno.start_time) {
            turno.start_time = turno.start_time.slice(0, 16);
          }
          if (turno.end_time) {
            turno.end_time = turno.end_time.slice(0, 16);
          }
          
          this.turnoForm.patchValue(turno);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
          alert('Error al cargar el turno');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.turnoForm.valid) {
      this.loading = true;
      const turnoData: Shift = this.turnoForm.value;

      // Asegurar formato ISO completo para las fechas
      if (turnoData.start_time && !turnoData.start_time.includes('T')) {
        turnoData.start_time = turnoData.start_time + ':00';
      }
      if (turnoData.end_time && !turnoData.end_time.includes('T')) {
        turnoData.end_time = turnoData.end_time + ':00';
      }

      const operation = this.isEdit && this.turnoId
        ? this.shiftService.update(this.turnoId, turnoData)
        : this.shiftService.create(turnoData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Turno ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/turnos']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el turno`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/turnos']);
  }
}