// src/app/modules/gestion/menu-form/menu-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../../shared/interfaces/menu.interface';
import { MenuService } from '../../../shared/services/menu.service';
import { RestauranteService } from '../../../shared/services/restaurante.service';
import { ProductoService } from 'src/app/shared/services/producto.service';

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html'
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  isEdit = false;
  menuId: number | null = null;
  loading = false;
  loadingData = false;

  // Arrays para los selects
  restaurantOptions: SelectOption[] = [];
  productOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private restaurantService: RestauranteService,
    private productService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.menuForm = this.fb.group({
      restaurant_id: [null, [Validators.required]],
      product_id: [null, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadProducts();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.menuId = +params['id'];
        this.loadMenu();
      }
    });
  }

  loadRestaurants(): void {
    this.loadingData = true;
    this.restaurantService.getAll().subscribe({
      next: (restaurants) => {
        this.restaurantOptions = restaurants.map(restaurant => ({
          value: restaurant.id,
          label: restaurant.name || `Restaurante ${restaurant.id}`
        }));
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar restaurantes:', error);
        this.loadingData = false;
        alert('Error al cargar la lista de restaurantes');
      }
    });
  }

  loadProducts(): void {
    this.loadingData = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productOptions = products.map(product => ({
          value: product.id,
          label: product.name || `Producto ${product.id}`
        }));
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loadingData = false;
        alert('Error al cargar la lista de productos');
      }
    });
  }

  loadMenu(): void {
    if (this.menuId) {
      this.loading = true;
      this.menuService.getById(this.menuId).subscribe({
        next: (menu) => {
          this.menuForm.patchValue(menu);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar el item del menú');
          this.loading = false;
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