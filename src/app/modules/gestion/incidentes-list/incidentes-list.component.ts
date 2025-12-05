// src/app/modules/gestion/incidentes-list/incidentes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from '../../../shared/interfaces/issue.interface';
import { IssueService } from '../../../shared/services/issue.service';

@Component({
  selector: 'app-incidentes-list',
  templateUrl: './incidentes-list.component.html'
})
export class IncidentesListComponent implements OnInit {
  incidentes: Issue[] = [];
  loading = true;

  constructor(
    private issueService: IssueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidentes();
  }

  loadIncidentes(): void {
    this.loading = true;
    this.issueService.getAll().subscribe({
      next: (data) => {
        this.incidentes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los incidentes');
      }
    });
  }

  editIncidente(id: number): void {
    this.router.navigate(['/gestion/incidentes/editar', id]);
  }

  createIncidente(): void {
    this.router.navigate(['/gestion/incidentes/crear']);
  }

  deleteIncidente(id: number): void {
    const incidente = this.incidentes.find(i => i.id === id);
    
    if (confirm(`¿Estás seguro de eliminar este incidente?`)) {
      this.issueService.delete(id).subscribe({
        next: () => {
          alert('Incidente eliminado correctamente');
          this.incidentes = this.incidentes.filter(i => i.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar el incidente');
        }
      });
    }
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'accident': return 'bg-danger';
      case 'mechanical': return 'bg-warning';
      case 'flat_tire': return 'bg-info';
      case 'other': return 'bg-secondary';
      default: return 'bg-light';
    }
  }

  getTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'accident': 'Accidente',
      'mechanical': 'Falla Mecánica',
      'flat_tire': 'Pinchazo',
      'other': 'Otro'
    };
    return typeMap[type] || type;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'open': return 'bg-warning';
      case 'in_progress': return 'bg-info';
      case 'resolved': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'open': 'Abierto',
      'in_progress': 'En Progreso',
      'resolved': 'Resuelto'
    };
    return statusMap[status] || status;
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES');
  }

  getIncidentesAbiertos(): number {
    return this.incidentes.filter(i => i.status === 'open').length;
  }
}