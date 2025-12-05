import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Guardar la URL a la que intentaba acceder para redirigir después del login
    const returnUrl = state.url;
    console.warn('Acceso denegado. Redirigiendo a login...', { returnUrl });
    
    // Redirigir al login
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl }
    });
  }
}
