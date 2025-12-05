import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/services/security.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public currentUser: User | null = null;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authService: AuthService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    // Obtener usuario actual
    this.currentUser = this.authService.getCurrentUser();
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Obtiene la foto del usuario o una por defecto
   */
  getUserPhoto(): string {
    if (this.currentUser?.photo) {
      return this.currentUser.photo;
    }
    // Si no hay foto, retornar null para usar avatar con iniciales
    return null;
  }

  /**
   * Obtiene el nombre del usuario
   */
  getUserName(): string {
    return this.currentUser?.name || 'Usuario';
  }

  /**
   * Obtiene las iniciales del nombre del usuario
   */
  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    
    const names = this.currentUser.name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  /**
   * Verifica si el usuario tiene foto
   */
  hasUserPhoto(): boolean {
    return !!this.currentUser?.photo;
  }

}
