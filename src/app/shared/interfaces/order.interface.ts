import { Cliente } from "./cliente.interface";
import { Menu } from "./menu.interface";
import { Motorcycle } from "./motorcycle.interface";

// src/app/shared/interfaces/order.interface.ts (o pedido.interface.ts)
export interface Order {
  id?: number;
  customer_id: number;
  menu_id: number;
  motorcycle_id?: number | null; // Hacerlo opcional
  quantity: number;
  total_price?: number; // Hacerlo opcional - el backend lo calcula
  status: string;
  created_at?: Date;
  updated_at?: Date;
  
  // Relaciones (opcionales)
  customer?: Cliente;
  menu?: Menu;
  motorcycle?: Motorcycle;
}