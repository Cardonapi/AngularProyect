// src/app/shared/interfaces/address.interface.ts
export interface Address {
  id?: number;
  order_id?: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;  // ← Cambiado de zip_code a postal_code
  additional_info?: string;
  country?: string; // ← Opcional si el backend no lo usa
}