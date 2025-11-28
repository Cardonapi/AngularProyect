// src/app/interfaces/order.interface.ts
export interface Order {
  id?: number;
  customer_id: number;
  menu_id: number;
  motorcycle_id?: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled';
  order_date?: string;
}

export interface Menu {
  id?: number;
  price: number;
  restaurant_id: number;
  product_id: number;
}

export interface Restaurantes {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Productos {
  id?: number;
  name: string;
  description: string;
  category: string;
}