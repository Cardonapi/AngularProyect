// src/app/shared/services/motorcycle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Motorcycle } from '../interfaces/motorcycle.interface';

@Injectable({
  providedIn: 'root'
})
export class MotorcycleService {
  private apiUrl = `${environment.apiUrl}/motorcycles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(this.apiUrl);
  }

  getById(id: number): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${this.apiUrl}/${id}`);
  }

  create(motorcycle: Motorcycle): Observable<Motorcycle> {
    return this.http.post<Motorcycle>(this.apiUrl, motorcycle);
  }

  update(id: number, motorcycle: Motorcycle): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${this.apiUrl}/${id}`, motorcycle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Añade este método
  getAvailable(): Observable<Motorcycle[]> {
    // Si tu backend tiene endpoint /available
    return this.http.get<Motorcycle[]>(`${this.apiUrl}/available`);
    
    // O si no tiene, usa getAll() y filtra localmente
    // return this.getAll().pipe(
    //   map(motorcycles => motorcycles.filter(moto => moto.status === 'available'))
    // );
  }
}