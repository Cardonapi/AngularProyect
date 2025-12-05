// src/app/shared/interfaces/motorcycle.interface.ts
export interface Motorcycle {
   id: number;
  license_plate: string;  // ← Esto es lo que espera el backend
  brand: string;          // ← Esto es lo que espera el backend
  year: number;           // ← Esto es lo que espera el backend
  status: string;         // ← Esto es lo que espera el backend
  
}