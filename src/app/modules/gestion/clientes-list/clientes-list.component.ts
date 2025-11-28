// src/app/modules/gestion/clientes-list/clientes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../../shared/interfaces/cliente.interface';
import { ClienteService } from '../../../shared/services/cliente.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html'
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = true;

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
        console.log('Clientes cargados:', data);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los clientes');
      }
    });
  }

  editCliente(id: number): void {
    this.router.navigate(['/gestion/clientes/editar', id]);
  }

  createCliente(): void {
    this.router.navigate(['/gestion/clientes/nuevo']);
  }

  deleteCliente(id: number): void {
    const cliente = this.clientes.find(c => c.id === id);
    
    if (confirm(`¿Estás seguro de eliminar al cliente "${cliente?.name}"?`)) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          alert('✅ Cliente eliminado correctamente');
          this.clientes = this.clientes.filter(c => c.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('❌ Error al eliminar el cliente');
        }
      });
    }
  }
}