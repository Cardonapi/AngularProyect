// src/app/shared/services/photo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Photo } from '../interfaces/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) {}

  // GET /photos - Devuelve lista de fotos (JSON)
  getAll(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  // GET /photos/{id} - Devuelve la imagen (blob)
  getImageById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  // GET /photos/{id}/info - Para obtener metadata (si existe)
  getInfoById(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}/info`);
  }

  // POST /photos - Subir nueva foto
  create(photoData: FormData): Observable<Photo> {
    return this.http.post<Photo>(this.apiUrl, photoData);
  }

  // DELETE /photos/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}