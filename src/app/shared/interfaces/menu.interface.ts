import { Producto } from "./producto.interface";
import { Restaurante } from "./restaurante.interface";

// src/app/shared/interfaces/menu.interface.ts
export interface Menu {
  id?: number;
  price: number;
  restaurant_id: number;
  product_id: number;
  restaurant?: Restaurante;  // Opcional: datos del restaurante
  product?: Producto;        // Opcional: datos del producto
}