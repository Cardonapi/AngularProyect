// src/app/modules/gestion/fotos-list/fotos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Photo } from '../../../shared/interfaces/photo.interface';
import { PhotoService } from '../../../shared/services/photo.service';

@Component({
  selector: 'app-fotos-list',
  templateUrl: './fotos-list.component.html'
})
export class FotosListComponent implements OnInit {
  fotos: Photo[] = [];
  loading = true;
  imagePreviews: { [key: number]: SafeUrl } = {};

  constructor(
    private photoService: PhotoService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFotos();
  }

  loadFotos(): void {
    this.loading = true;
    this.photoService.getAll().subscribe({
      next: (data) => {
        this.fotos = data;
        // Cargar previews de imágenes
        this.loadImagePreviews();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar las fotos');
      }
    });
  }

  loadImagePreviews(): void {
    this.fotos.forEach(foto => {
      if (foto.id) {
        this.photoService.getImageById(foto.id).subscribe({
          next: (blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.imagePreviews[foto.id!] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          },
          error: (error) => {
            console.error('Error cargando imagen:', error);
          }
        });
      }
    });
  }

  createFoto(): void {
    this.router.navigate(['/gestion/fotos/subir']);
  }

  deleteFoto(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta foto?')) {
      this.photoService.delete(id).subscribe({
        next: () => {
          alert('Foto eliminada correctamente');
          this.fotos = this.fotos.filter(f => f.id !== id);
          delete this.imagePreviews[id];
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar la foto');
        }
      });
    }
  }

  getImageUrl(fotoId: number): SafeUrl | string {
    return this.imagePreviews[fotoId] || 'assets/img/placeholder.jpg';
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES');
  }
}