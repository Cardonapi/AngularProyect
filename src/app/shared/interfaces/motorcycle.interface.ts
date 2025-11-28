// src/app/shared/interfaces/motorcycle.interface.ts
export interface Motorcycle {
  id?: number;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: 'active' | 'maintenance' | 'inactive';
}