// src/app/modules/gestion/direcciones-list/direcciones-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../../../shared/interfaces/address.interface';
import { AddressService } from '../../../shared/services/address.service';

@Component({
  selector: 'app-direcciones-list',
  templateUrl: './direcciones-list.component.html'
})
export class DireccionesListComponent implements OnInit {
  direcciones: Address[] = [];
  loading = true;

  constructor(
    private addressService: AddressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDirecciones();
  }

  loadDirecciones(): void {
    this.loading = true;
    this.addressService.getAll().subscribe({
      next: (data) => {
        this.direcciones = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar las direcciones');
      }
    });
  }

  editDireccion(id: number): void {
    this.router.navigate(['/gestion/direcciones/editar', id]);
  }

  createDireccion(): void {
    this.router.navigate(['/gestion/direcciones/crear']);
  }

  deleteDireccion(id: number): void {
    const direccion = this.direcciones.find(d => d.id === id);
    
    if (confirm(`¿Estás seguro de eliminar esta dirección?`)) {
      this.addressService.delete(id).subscribe({
        next: () => {
          alert('Dirección eliminada correctamente');
          this.direcciones = this.direcciones.filter(d => d.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar la dirección');
        }
      });
    }
  }

  getFullAddress(direccion: Address): string {
    return `${direccion.street}, ${direccion.city}, ${direccion.state}, ${direccion.country}`;
  }
}