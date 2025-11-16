// src/app/shared/services/restaurante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Restaurante } from '../interfaces/restaurante.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {
  private apiUrl = `${environment.apiUrl}/restaurants`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Restaurante[]> {
    console.log('🔗 Conectando a:', this.apiUrl);
    return this.http.get<Restaurante[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(restaurante: Restaurante): Observable<Restaurante> {
    return this.http.post<Restaurante>(this.apiUrl, restaurante, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError));
  }

  update(id: number, restaurante: Restaurante): Observable<Restaurante> {
    return this.http.put<Restaurante>(`${this.apiUrl}/${id}`, restaurante, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('❌ Error del servicio:', error);
    
    let errorMessage = 'Error desconocido';
    if (error.status === 0) {
      errorMessage = 'Error de CORS: El backend no permite conexiones desde este origen';
    } else if (error.status === 404) {
      errorMessage = 'Endpoint no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}