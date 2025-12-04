// src/app/modules/gestion/motos-list/motos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Motorcycle } from '../../../shared/interfaces/motorcycle.interface';
import { MotorcycleService } from '../../../shared/services/motorcycle.service';

@Component({
  selector: 'app-motos-list',
  templateUrl: './motos-list.component.html'
})
export class MotosListComponent implements OnInit {
  motos: Motorcycle[] = [];
  loading = true;

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
      next: (data) => {
        this.motos = data;
        this.loading = false;
        console.log('Motos cargadas:', data);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar las motos');
      }
    });
  }

  editMoto(id: number): void {
    this.router.navigate(['/gestion/motos/editar', id]);
  }

  createMoto(): void {
    this.router.navigate(['/gestion/motos/nuevo']);
  }

  deleteMoto(id: number): void {
    const moto = this.motos.find(m => m.id === id);
    
    if (confirm(`¿Estás seguro de eliminar la moto "${moto?.license_plate}"?`)) {
      this.motorcycleService.delete(id).subscribe({
        next: () => {
          alert('✅ Moto eliminada correctamente');
          this.motos = this.motos.filter(m => m.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('❌ Error al eliminar la moto');
        }
      });
    }
  }
}