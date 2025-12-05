import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token inválido o expirado - cerrar sesión
          console.error('Error 401: No autorizado. Cerrando sesión...');
          this.authService.logout();
        } else if (error.status === 403) {
          // Acceso prohibido
          console.error('Error 403: Acceso prohibido');
          this.router.navigate(['/dashboard']);
        } else if (error.status === 0) {
          // Error de conexión
          console.error('Error de conexión con el servidor');
        }

        // Propagar el error para que el componente lo maneje
        return throwError(() => error);
      })
    );
  }
}
