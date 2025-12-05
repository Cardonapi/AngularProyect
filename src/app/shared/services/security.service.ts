import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  token: string;
  password?: string;
  user?: any; // Datos adicionales del usuario
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  /**
   * Guarda la sesión del usuario en localStorage
   * Similar a la función saveSession de la captura
   */
  saveSession(dataSession: User): void {
    console.log('=== DATOS RECIBIDOS ===', dataSession);

    // Extraer la foto de diferentes posibles ubicaciones
    let photoUrl: string | null = null;

    if (dataSession['photo']) {
      photoUrl = dataSession['photo'];
    } else if (dataSession['photoURL']) {
      photoUrl = dataSession['photoURL'];
    } else if (dataSession.user && dataSession.user.photoURL) {
      photoUrl = dataSession.user.photoURL;
    }

    console.log('=== PHOTO URL ENCONTRADA ===', photoUrl);

    // Construir objeto User con la estructura correcta
    let data: User = {
      id: dataSession['id'] || dataSession.user?.uid,
      name: dataSession['name'] || dataSession.user?.displayName,
      email: dataSession['email'] || dataSession.user?.email,
      password: '',
      token: dataSession['token'] || dataSession.user?.uid,
      photo: photoUrl || undefined
    };

    console.log('=== DATOS A GUARDAR ===', data);

    // Guardar en localStorage
    localStorage.setItem('session', JSON.stringify(data));

    // Verificación
    const saved = localStorage.getItem('session');
    console.log('=== GUARDADO EN LOCALSTORAGE ===', JSON.parse(saved!));
  }

  /**
   * Obtiene la sesión actual del usuario
   */
  getSession(): User | null {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  }

  /**
   * Obtiene el token del usuario activo
   */
  getToken(): string | null {
    const session = this.getSession();
    return session?.token || null;
  }

  /**
   * Verifica si hay una sesión activa
   */
  isAuthenticated(): boolean {
    return !!this.getSession();
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('session');
  }

  /**
   * Obtiene información del usuario activo
   */
  getActiveUserSession(): User | null {
    return this.getSession();
  }
}
