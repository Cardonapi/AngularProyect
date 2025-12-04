// src/app/shared/interfaces/driver.interface.ts
export interface Driver {
  id?: number;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  status: 'available' | 'unavailable';
  created_at?: string;
}