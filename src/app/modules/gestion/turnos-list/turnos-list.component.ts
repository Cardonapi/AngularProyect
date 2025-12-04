// src/app/modules/gestion/turnos-list/turnos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shift } from '../../../shared/interfaces/shift.interface';
import { ShiftService } from '../../../shared/services/shift.service';

@Component({
  selector: 'app-turnos-list',
  templateUrl: './turnos-list.component.html'
})
export class TurnosListComponent implements OnInit {
  turnos: Shift[] = [];
  loading = true;
  turnosActivos: number = 0; // ← Asegúrate que esta línea exista

  constructor(
    private shiftService: ShiftService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTurnos();
  }

  loadTurnos(): void {
    this.loading = true;
    this.shiftService.getAll().subscribe({
      next: (data) => {
        this.turnos = data;
        this.turnosActivos = data.filter(t => t.status === 'active').length; // ← Y esta
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los turnos');
      }
    });
  }

  editTurno(id: number): void {
    this.router.navigate(['/gestion/turnos/editar', id]);
  }

  createTurno(): void {
    this.router.navigate(['/gestion/turnos/crear']);
  }

  deleteTurno(id: number): void {
    const turno = this.turnos.find(t => t.id === id);
    
    if (confirm(`¿Estás seguro de eliminar este turno?`)) {
      this.shiftService.delete(id).subscribe({
        next: () => {
          alert('Turno eliminado correctamente');
          this.turnos = this.turnos.filter(t => t.id !== id);
          this.turnosActivos = this.turnos.filter(t => t.status === 'active').length; // ← Y esta
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar el turno');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success';
      case 'completed': return 'bg-info';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Activo',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES');
  }
}