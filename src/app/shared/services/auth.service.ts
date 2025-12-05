import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SecurityService, User } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private securityService: SecurityService
  ) {
    // Cargar usuario desde SecurityService al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Carga el usuario almacenado en localStorage a través de SecurityService
   */
  private loadUserFromStorage(): void {
    const user = this.securityService.getSession();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return this.securityService.getToken();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.securityService.isAuthenticated();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.securityService.getActiveUserSession();
  }

  /**
   * Cierra sesión y redirige al login
   */
  logout(): void {
    this.securityService.logout();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
}
