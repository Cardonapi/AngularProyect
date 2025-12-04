// src/app/modules/gestion/conductores-list/conductores-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from '../../../shared/interfaces/driver.interface';
import { DriverService } from '../../../shared/services/driver.service';

@Component({
  selector: 'app-conductores-list',
  templateUrl: './conductores-list.component.html'
})
export class ConductoresListComponent implements OnInit {
  conductores: Driver[] = [];
  loading = true;

  constructor(
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConductores();
  }

  loadConductores(): void {
    this.loading = true;
    this.driverService.getAll().subscribe({
      next: (data) => {
        this.conductores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los conductores');
      }
    });
  }

  editConductor(id: number): void {
    this.router.navigate(['/gestion/conductores/editar', id]);
  }

  createConductor(): void {
    this.router.navigate(['/gestion/conductores/crear']);
  }

  deleteConductor(id: number): void {
    const conductor = this.conductores.find(c => c.id === id);
    
    if (confirm(`¿Estás seguro de eliminar al conductor "${conductor?.name}"?`)) {
      this.driverService.delete(id).subscribe({
        next: () => {
          alert('Conductor eliminado correctamente');
          this.conductores = this.conductores.filter(c => c.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar el conductor');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'available' ? 'bg-success' : 'bg-danger';
  }

  getStatusText(status: string): string {
    return status === 'available' ? 'Disponible' : 'No Disponible';
  }
}