// src/app/modules/gestion/gestion.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ ESTA LÍNEA ES CRÍTICA
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RestaurantesListComponent } from './restaurantes-list/restaurantes-list.component';
import { RestaurantesFormComponent } from './restaurantes-form/restaurantes-form.component';
import { ProductosListComponent } from './productos-list/productos-list.component';
import { ProductosFormComponent } from './productos-form/productos-form.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { GestionRoutingModule } from './gestion-routing.module';

import { PedidosListComponent } from './pedidos-list/pedidos-list.component';  // ← Nuevo
import { PedidoFormComponent } from './pedido-form/pedido-form.component';      // ← Ya existe
import { MenusListComponent } from './menus-list/menus-list.component';
import { MenuFormComponent } from './menus-form/menu-form.component';
import { MotosListComponent } from './motos-list/motos-list.component';
import { MotoFormComponent } from './moto-form/moto-form.component';

@NgModule({
  declarations: [
    RestaurantesListComponent,
    RestaurantesFormComponent,
    ProductosListComponent,
    ProductosFormComponent,
    ClientesListComponent,    
    ClientesFormComponent,
    PedidosListComponent,     
    PedidoFormComponent,
    MenusListComponent,
    MenuFormComponent,
    MotosListComponent,
    MotoFormComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // ✅ DEBE estar aquí para formularios
    RouterModule,
    NgbModule,
    GestionRoutingModule
  ]
})
export class GestionModule { }