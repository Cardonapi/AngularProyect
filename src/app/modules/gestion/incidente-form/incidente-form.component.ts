// src/app/modules/gestion/incidente-form/incidente-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../../shared/interfaces/issue.interface';
import { IssueService } from '../../../shared/services/issue.service';

@Component({
  selector: 'app-incidente-form',
  templateUrl: './incidente-form.component.html'
})
export class IncidenteFormComponent implements OnInit {
  incidenteForm: FormGroup;
  isEdit = false;
  incidenteId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.incidenteForm = this.fb.group({
      motorcycle_id: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      issue_type: ['accident', Validators.required], // ← Cambiado a 'issue_type'
      date_reported: ['', Validators.required],      // ← Cambiado a 'date_reported'
      status: ['open', Validators.required]          // ← Estado por defecto 'open'
      // Nota: driver_id y shift_id se quitan porque el backend no los usa en create
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.incidenteId = +params['id'];
        this.loadIncidente();
      } else {
        // Si es nuevo, establecer fecha actual por defecto
        const now = new Date().toISOString().slice(0, 16);
        this.incidenteForm.patchValue({ date_reported: now });
      }
    });
  }

  loadIncidente(): void {
    if (this.incidenteId) {
      this.loading = true;
      this.issueService.getById(this.incidenteId).subscribe({
        next: (incidente) => {
          // Convertir fecha para el input
          if (incidente.date_reported) {
            incidente.date_reported = incidente.date_reported.slice(0, 16);
          }
          
          this.incidenteForm.patchValue(incidente);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
          alert('Error al cargar el incidente');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.incidenteForm.valid) {
      this.loading = true;
      const incidenteData: Issue = this.incidenteForm.value;

      // Asegurar formato ISO completo para la fecha
      if (incidenteData.date_reported && !incidenteData.date_reported.includes('T')) {
        incidenteData.date_reported = incidenteData.date_reported + ':00';
      }

      const operation = this.isEdit && this.incidenteId
        ? this.issueService.update(this.incidenteId, incidenteData)
        : this.issueService.create(incidenteData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Incidente ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/incidentes']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el incidente`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/incidentes']);
  }
}