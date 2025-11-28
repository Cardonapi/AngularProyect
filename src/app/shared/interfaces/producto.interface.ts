// src/app/shared/interfaces/producto.interface.ts
export interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at?: string;
}