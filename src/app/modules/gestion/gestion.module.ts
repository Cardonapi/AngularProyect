// src/app/modules/gestion/gestion.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RestaurantesListComponent } from './restaurantes-list/restaurantes-list.component';
import { RestaurantesFormComponent } from './restaurantes-form/restaurantes-form.component';
import { ProductosListComponent } from './productos-list/productos-list.component';
import { ProductosFormComponent } from './productos-form/productos-form.component';

const routes: Routes = [
  { path: 'restaurantes', component: RestaurantesListComponent },
  { path: 'restaurantes/nuevo', component: RestaurantesFormComponent },
  { path: 'restaurantes/editar/:id', component: RestaurantesFormComponent },

  { path: 'productos', component: ProductosListComponent },
  { path: 'productos/nuevo', component: ProductosFormComponent },
  { path: 'productos/editar/:id', component: ProductosFormComponent },
  
  { path: '', redirectTo: 'restaurantes', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RestaurantesListComponent,
    RestaurantesFormComponent,
    ProductosListComponent,
    ProductosFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule
  ]
})
export class GestionModule { }