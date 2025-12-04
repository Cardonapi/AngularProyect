// src/app/shared/services/driver.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Driver } from '../interfaces/driver.interface';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = `${environment.apiUrl}/drivers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  getById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  create(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  update(id: number, driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${id}`, driver);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}