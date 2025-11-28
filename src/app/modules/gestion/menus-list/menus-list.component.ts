// src/app/modules/gestion/menus-list/menus-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../../shared/interfaces/menu.interface';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-menus-list',
  templateUrl: './menus-list.component.html'
})
export class MenusListComponent implements OnInit {
  menus: Menu[] = [];
  loading = true;

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.loading = true;
    this.menuService.getAll().subscribe({
      next: (data) => {
        this.menus = data;
        this.loading = false;
        console.log('Menús cargados:', data);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        alert('Error al cargar los menús');
      }
    });
  }

  editMenu(id: number): void {
    this.router.navigate(['/gestion/menus/editar', id]);
  }

  createMenu(): void {
    this.router.navigate(['/gestion/menus/nuevo']);
  }

  deleteMenu(id: number): void {
    const menu = this.menus.find(m => m.id === id);
    
    if (confirm(`¿Estás seguro de eliminar este item del menú?`)) {
      this.menuService.delete(id).subscribe({
        next: () => {
          alert('✅ Item del menú eliminado correctamente');
          this.menus = this.menus.filter(m => m.id !== id);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('❌ Error al eliminar el item del menú');
        }
      });
    }
  }
}