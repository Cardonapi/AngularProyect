// src/app/modules/gestion/turno-form/turno-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Shift } from '../../../shared/interfaces/shift.interface';
import { ShiftService } from '../../../shared/services/shift.service';
import { DriverService } from '../../../shared/services/driver.service'; // Asumo que existe
import { MotorcycleService } from '../../../shared/services/motorcycle.service';

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-turno-form',
  templateUrl: './turno-form.component.html'
})
export class TurnoFormComponent implements OnInit {
  turnoForm: FormGroup;
  isEdit = false;
  turnoId: number | null = null;
  loading = false;
  loadingData = false;

  // Arrays para los selects
  driverOptions: SelectOption[] = [];
  motorcycleOptions: SelectOption[] = [];

  // Opciones para estado
  statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private driverService: DriverService,
    private motorcycleService: MotorcycleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.turnoForm = this.fb.group({
      driver_id: ['', [Validators.required]],
      motorcycle_id: ['', [Validators.required]],
      start_time: ['', Validators.required],
      end_time: [''],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar todos los datos necesarios
    this.loadAllData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.turnoId = +params['id'];
        
        // Esperar a que carguen los datos antes de cargar el turno
        if (!this.loadingData) {
          setTimeout(() => this.loadTurno(), 100);
        }
      } else {
        // Si es nuevo, establecer hora actual por defecto
        const now = new Date().toISOString().slice(0, 16);
        this.turnoForm.patchValue({ start_time: now });
      }
    });
  }

  // ======================
  //   CARGAR TODOS LOS DATOS
  // ======================
  loadAllData(): void {
    this.loadingData = true;
    
    // Usar forkJoin para cargar conductores y motos en paralelo
    forkJoin({
      drivers: this.driverService.getAll(),
      motorcycles: this.motorcycleService.getAll()
    }).subscribe({
      next: (results) => {
        // Procesar conductores
        this.driverOptions = this.processDrivers(results.drivers);
        
        // Procesar motocicletas - mostrar "Moto #ID"
        this.motorcycleOptions = this.processMotorcycles(results.motorcycles);
        
        this.loadingData = false;
        
        // Si estamos en modo edición y ya cargamos los datos, cargar el turno
        if (this.isEdit && this.turnoId) {
          this.loadTurno();
        }
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.loadingData = false;
        alert('Error al cargar los datos del formulario');
      }
    });
  }

  private processDrivers(drivers: any[]): SelectOption[] {
    if (!drivers || drivers.length === 0) {
      return [];
    }
    
    return drivers.map(driver => {
      // Crear etiqueta descriptiva para el conductor
      let label = `Conductor #${driver.id}`;
      
      if (driver.name) {
        label = `${driver.name}`;
        
        if (driver.email) {
          label += ` - ${driver.email}`;
        } else if (driver.phone) {
          label += ` - ${driver.phone}`;
        }
      } else if (driver.email) {
        label = driver.email;
      }
      
      return {
        value: driver.id,
        label: label
      };
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
      
      // Opcional: añadir estado si está disponible
      if (motorcycle.status) {
        const statusIcon = this.getMotorcycleStatusIcon(motorcycle.status);
        if (statusIcon) {
          label += ` ${statusIcon}`;
        }
      }
      
      return {
        value: motorcycle.id,
        label: label
      };
    });
  }

  private getMotorcycleStatusIcon(status: string): string {
    const statusMap: {[key: string]: string} = {
      'available': '🟢',
      'in_use': '🔵', 
      'maintenance': '🟡',
      'unavailable': '🔴'
    };
    return statusMap[status] || '';
  }

  // ==========================
  //      CARGAR TURNO
  // ==========================
  loadTurno(): void {
    if (this.turnoId && !this.loadingData) {
      this.loading = true;
      
      this.shiftService.getById(this.turnoId).subscribe({
        next: (turno: Shift) => {
          // Convertir fechas para el input datetime-local
          const startTime = turno.start_time ? turno.start_time.slice(0, 16) : '';
          const endTime = turno.end_time ? turno.end_time.slice(0, 16) : '';
          
          this.turnoForm.patchValue({
            driver_id: turno.driver_id ? turno.driver_id.toString() : '',
            motorcycle_id: turno.motorcycle_id ? turno.motorcycle_id.toString() : '',
            start_time: startTime,
            end_time: endTime,
            status: turno.status || 'active'
          });
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar turno:', error);
          alert('Error al cargar el turno');
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
    this.markFormGroupTouched(this.turnoForm);
    
    if (this.turnoForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;
    
    const turnoData: Shift = {
      driver_id: Number(this.turnoForm.value.driver_id),
      motorcycle_id: Number(this.turnoForm.value.motorcycle_id),
      start_time: this.formatDateTime(this.turnoForm.value.start_time),
      end_time: this.turnoForm.value.end_time ? this.formatDateTime(this.turnoForm.value.end_time) : null,
      status: this.turnoForm.value.status
    };

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
    this.router.navigate(['/gestion/turnos']);
  }

  // Getters para el template (opcionales pero útiles)
  get driver_id() { return this.turnoForm.get('driver_id'); }
  get motorcycle_id() { return this.turnoForm.get('motorcycle_id'); }
  get start_time() { return this.turnoForm.get('start_time'); }
  get end_time() { return this.turnoForm.get('end_time'); }
  get status() { return this.turnoForm.get('status'); }
}