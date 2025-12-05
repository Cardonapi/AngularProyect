// src/app/shared/interfaces/issue.interface.ts
export interface Issue {
  id?: number;
  motorcycle_id: number;
  description: string;
  issue_type: string;  // ← Cambiado de 'type' a 'issue_type'
  date_reported: string; // ← Cambiado de 'date' a 'date_reported'
  status: 'open' | 'in_progress' | 'resolved'; // ← Estados diferentes
  // Campos opcionales que el backend no usa en create
  driver_id?: number;  
  shift_id?: number;
}