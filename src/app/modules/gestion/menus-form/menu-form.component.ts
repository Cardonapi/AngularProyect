// src/app/modules/gestion/menu-form/menu-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../../shared/interfaces/menu.interface';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html'
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  isEdit = false;
  menuId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.menuForm = this.fb.group({
      restaurant_id: [null, [Validators.required, Validators.min(1)]],
      product_id: [null, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.menuId = +params['id'];
        this.loadMenu();
      }
    });
  }

  loadMenu(): void {
    if (this.menuId) {
      this.menuService.getById(this.menuId).subscribe({
        next: (menu) => {
          this.menuForm.patchValue(menu);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar el item del menú');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.menuForm.valid) {
      this.loading = true;
      const menuData = this.menuForm.value;

      const operation = this.isEdit && this.menuId
        ? this.menuService.update(this.menuId, menuData)
        : this.menuService.create(menuData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Item del menú ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/menus']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el item del menú`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/menus']);
  }
}