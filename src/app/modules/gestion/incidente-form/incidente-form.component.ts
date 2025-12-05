// src/app/modules/gestion/incidente-form/incidente-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../../shared/interfaces/issue.interface';
import { IssueService } from '../../../shared/services/issue.service';
import { MotorcycleService } from '../../../shared/services/motorcycle.service';

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-incidente-form',
  templateUrl: './incidente-form.component.html'
})
export class IncidenteFormComponent implements OnInit {
  incidenteForm: FormGroup;
  isEdit = false;
  incidenteId: number | null = null;
  loading = false;
  loadingData = false;

  // Array para el select de motos
  motorcycleOptions: SelectOption[] = [];

  // Tipos de incidente según lo que probablemente espera el backend
  issueTypeOptions = [
    { value: 'accident', label: 'Accidente' },
    { value: 'breakdown', label: 'Avería' },
    { value: 'theft', label: 'Robo' },
    { value: 'vandalism', label: 'Vandalismo' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'other', label: 'Otro' }
  ];

  // Opciones para estado
  statusOptions = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' }
  ];

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private motorcycleService: MotorcycleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.incidenteForm = this.fb.group({
      motorcycle_id: ['', [Validators.required]], // Cambiado para usar select
      description: ['', [Validators.required, Validators.minLength(10)]],
      issue_type: ['accident', Validators.required],
      date_reported: ['', Validators.required],
      status: ['open', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar motos para el select
    this.loadMotorcycles();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.incidenteId = +params['id'];
        
        // Esperar a que carguen las motos antes de cargar el incidente
        if (!this.loadingData) {
          setTimeout(() => this.loadIncidente(), 100);
        }
      } else {
        // Si es nuevo, establecer fecha actual por defecto
        const now = new Date().toISOString().slice(0, 16);
        this.incidenteForm.patchValue({ date_reported: now });
      }
    });
  }

  // ======================
  //   CARGAR MOTOCICLETAS
  // ======================
  loadMotorcycles(): void {
    this.loadingData = true;
    
    this.motorcycleService.getAll().subscribe({
      next: (motorcycles) => {
        this.motorcycleOptions = this.processMotorcycles(motorcycles);
        this.loadingData = false;
        
        // Si estamos en modo edición y ya cargamos los datos, cargar el incidente
        if (this.isEdit && this.incidenteId) {
          this.loadIncidente();
        }
      },
      error: (error) => {
        console.error('Error al cargar motos:', error);
        this.loadingData = false;
        alert('Error al cargar la lista de motocicletas');
      }
    });
  }

  private processMotorcycles(motorcycles: any[]): SelectOption[] {
    if (!motorcycles || motorcycles.length === 0) {
      return [];
    }
    
    // Mostrar "Moto #ID" o con placa si está disponible
    return motorcycles.map(motorcycle => {
      let label: string;
      
      if (motorcycle.license_plate) {
        // Si tiene placa, mostrar "Moto #ID (PLACA)"
        label = `Moto #${motorcycle.id} (${motorcycle.license_plate})`;
      } else if (motorcycle.plate) {
        // Si tiene plate (alias de license_plate)
        label = `Moto #${motorcycle.id} (${motorcycle.plate})`;
      } else {
        // Solo ID
        label = `Moto #${motorcycle.id}`;
      }
      
      return {
        value: motorcycle.id,
        label: label
      };
    });
  }

  // ==========================
  //      CARGAR INCIDENTE
  // ==========================
  loadIncidente(): void {
    if (this.incidenteId && !this.loadingData) {
      this.loading = true;
      
      this.issueService.getById(this.incidenteId).subscribe({
        next: (incidente: Issue) => {
          // Convertir fecha para el input datetime-local
          const dateReported = incidente.date_reported ? incidente.date_reported.slice(0, 16) : '';
          
          this.incidenteForm.patchValue({
            motorcycle_id: incidente.motorcycle_id ? incidente.motorcycle_id.toString() : '',
            description: incidente.description || '',
            issue_type: incidente.issue_type || 'accident',
            date_reported: dateReported,
            status: incidente.status || 'open'
          });
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar incidente:', error);
          alert('Error al cargar el incidente');
          this.loading = false;
        }
      });
    }
  }

  // ==========================
  //      CREAR / EDITAR
  // ==========================
  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched(this.incidenteForm);
    
    if (this.incidenteForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;
    
    const incidenteData: Issue = {
      motorcycle_id: Number(this.incidenteForm.value.motorcycle_id),
      description: this.incidenteForm.value.description,
      issue_type: this.incidenteForm.value.issue_type,
      date_reported: this.formatDateTime(this.incidenteForm.value.date_reported),
      status: this.incidenteForm.value.status
    };

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

  /**
   * Formatear fecha y hora para el backend
   */
  private formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    
    // Asegurar formato ISO completo
    if (!dateTimeString.includes('T')) {
      return dateTimeString + ':00';
    }
    
    return dateTimeString;
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

  goBack(): void {
    this.router.navigate(['/gestion/incidentes']);
  }

  // Getters para el template (opcionales pero útiles)
  get motorcycle_id() { return this.incidenteForm.get('motorcycle_id'); }
  get description() { return this.incidenteForm.get('description'); }
  get issue_type() { return this.incidenteForm.get('issue_type'); }
  get date_reported() { return this.incidenteForm.get('date_reported'); }
  get status() { return this.incidenteForm.get('status'); }
}