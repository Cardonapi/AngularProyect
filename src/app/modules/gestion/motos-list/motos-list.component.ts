// src/app/modules/gestion/motos-list/motos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Motorcycle } from '../../../shared/interfaces/motorcycle.interface';
import { MotorcycleService } from '../../../shared/services/motorcycle.service';

@Component({
  selector: 'app-motos-list',
  templateUrl: './motos-list.component.html',
})
export class MotosListComponent implements OnInit {
  motos: Motorcycle[] = [];
  loading = false;

  constructor(
    private motorcycleService: MotorcycleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMotos();
  }

  loadMotos(): void {
    this.loading = true;
    this.motorcycleService.getAll().subscribe({
      next: (data: Motorcycle[]) => {
        console.log('✅ Motos cargadas:', data);
        this.motos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar motos:', error);
        this.loading = false;
        alert('Error al cargar la lista de motos');
      }
    });
  }

  createMoto(): void {
    this.router.navigate(['/gestion/motos/nuevo']);
  }

  editMoto(id: number): void {
    this.router.navigate(['/gestion/motos/editar', id]);
  }

  deleteMoto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta moto?')) {
      this.loading = true;
      this.motorcycleService.delete(id).subscribe({
        next: () => {
          console.log('✅ Moto eliminada ID:', id);
          this.loadMotos(); // Recargar la lista
          alert('Moto eliminada correctamente');
        },
        error: (error) => {
          console.error('❌ Error al eliminar moto:', error);
          this.loading = false;
          alert('Error al eliminar la moto');
        }
      });
    }
  }

  // Método para contar motos por estado (opcional, para estadísticas)
  getMotosByStatus(status: string): number {
    return this.motos.filter(moto => moto.status === status).length;
  }

  // Método para formatear la placa (opcional)
  formatLicensePlate(plate: string): string {
    if (!plate) return '';
    // Convertir a mayúsculas y agregar espacios si es necesario
    return plate.toUpperCase().replace(/([A-Z]{3})(\d{3})/, '$1 $2');
  }
}