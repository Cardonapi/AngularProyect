// src/app/modules/gestion/foto-upload/foto-upload.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PhotoService } from '../../../shared/services/photo.service';

@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html'
})
export class FotoUploadComponent {
  uploadForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private photoService: PhotoService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      issue_id: [null, [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.loading = true;
      
      const formData = new FormData();
      formData.append('issue_id', this.uploadForm.get('issue_id')?.value);
      formData.append('description', this.uploadForm.get('description')?.value || '');
      formData.append('image', this.selectedFile);

      this.photoService.create(formData).subscribe({
        next: (response) => {
          this.loading = false;
          alert('Foto subida correctamente');
          this.router.navigate(['/gestion/fotos']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert('Error al subir la foto');
        }
      });
    } else {
      if (!this.selectedFile) {
        alert('Por favor seleccione una imagen');
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/fotos']);
  }
}