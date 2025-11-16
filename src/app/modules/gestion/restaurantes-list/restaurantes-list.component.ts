// src/app/modules/gestion/restaurantes-list/restaurantes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurante } from '../../../shared/interfaces/restaurante.interface';
import { RestauranteService } from '../../../shared/services/restaurante.service';

@Component({
  selector: 'app-restaurantes-list',
  templateUrl: './restaurantes-list.component.html',
  styleUrls: ['./restaurantes-list.component.css']
})
export class RestaurantesListComponent implements OnInit {
  restaurantes: Restaurante[] = [];
  loading = true;

  constructor(
    private restauranteService: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurantes();
  }

  loadRestaurantes(): void {
    this.restauranteService.getAll().subscribe({
      next: (data) => {
        this.restaurantes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los restaurantes');
      }
    });
  }

  editRestaurante(id: number): void {
    this.router.navigate(['/gestion/restaurantes/editar', id]);
  }

  createRestaurante(): void {
    this.router.navigate(['/gestion/restaurantes/nuevo']);
  }

  deleteRestaurante(id: number): void {
    if (confirm('¿Estás seguro de eliminar este restaurante?')) {
      this.restauranteService.delete(id).subscribe({
        next: () => {
          this.restaurantes = this.restaurantes.filter(r => r.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar el restaurante');
        }
      });
    }
  }
}