// src/app/shared/interfaces/shift.interface.ts
export interface Shift {
  id?: number;
  driver_id: number;
  motorcycle_id: number;
  start_time: string;    // Formato ISO: "2024-01-15T08:00:00"
  end_time?: string;     // Opcional, mismo formato
  status: 'active' | 'completed' | 'cancelled';
}