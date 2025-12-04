import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
    {path: '/gestion/restaurantes',title: 'Restaurantes',icon: 'ni-shop text-green',class: ''},
    {path: '/gestion/productos', title: 'Productos', icon: 'ni-box-2 text-orange', class: ''},
    { path: '/gestion/clientes', title: 'Clientes', icon: 'ni-single-02 text-warning', class: '' },
    {path: '/gestion/pedidos', title: 'Pedidos', icon: 'ni-delivery-fast text-green', class: ''},
    { path: '/gestion/menus', title: 'Menús', icon: 'ni-ungroup text-info', class: '' },
    { path: '/gestion/motos', title: 'Motos', icon: 'fas fa-motorcycle text-blue', class: '' },
    { path: '/gestion/conductores', title: 'Conductores', icon: 'ni ni-badge text-warning', class: '' },
    { path: '/gestion/turnos', title: 'Turnos', icon: 'ni ni-watch-time text-purple', class: '' },
    { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
    { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
