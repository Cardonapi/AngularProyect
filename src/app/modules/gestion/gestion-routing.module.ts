// src/app/modules/gestion/gestion-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { RestaurantesListComponent } from './restaurantes-list/restaurantes-list.component';
import { RestaurantesFormComponent } from './restaurantes-form/restaurantes-form.component';
import { ProductosListComponent } from './productos-list/productos-list.component';
import { ProductosFormComponent } from './productos-form/productos-form.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';
import { PedidosListComponent } from './pedidos-list/pedidos-list.component';
import { MenusListComponent } from './menus-list/menus-list.component';
import { MenuFormComponent } from './menus-form/menu-form.component';
import { MotosListComponent } from './motos-list/motos-list.component';
import { MotoFormComponent } from './moto-form/moto-form.component';


// Definir rutas
const routes: Routes = [
  // Restaurantes
  { path: 'restaurantes', component: RestaurantesListComponent },
  { path: 'restaurantes/nuevo', component: RestaurantesFormComponent },
  { path: 'restaurantes/editar/:id', component: RestaurantesFormComponent },
  
  // Productos
  { path: 'productos', component: ProductosListComponent },
  { path: 'productos/nuevo', component: ProductosFormComponent },
  { path: 'productos/editar/:id', component: ProductosFormComponent },
  
  // Clientes
  { path: 'clientes', component: ClientesListComponent },
  { path: 'clientes/nuevo', component: ClientesFormComponent },
  { path: 'clientes/editar/:id', component: ClientesFormComponent },
  
  //Pedidos
  { path: 'pedidos', component: PedidosListComponent },           
  { path: 'pedidos/nuevo', component: PedidoFormComponent },
  { path: 'pedidos/editar/:id', component: PedidoFormComponent },


  //Menus
  { path: 'menus', component: MenusListComponent },
  { path: 'menus/nuevo', component: MenuFormComponent },
  { path: 'menus/editar/:id', component: MenuFormComponent },

  // Motos
  { path: 'motos', component: MotosListComponent },
  { path: 'motos/nuevo', component: MotoFormComponent },
  { path: 'motos/editar/:id', component: MotoFormComponent },
  


  // Ruta por defecto
  { path: '', redirectTo: 'restaurantes', pathMatch: 'full' }
];



// Exportar el módulo
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }