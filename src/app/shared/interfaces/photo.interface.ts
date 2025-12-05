// src/app/shared/interfaces/photo.interface.ts
export interface Photo {
  id?: number;
  issue_id: number;     // ID del incidente relacionado
  image_url: string;    // Ruta del archivo o URL
  description?: string;
  uploaded_at?: string; // Fecha de subida
}