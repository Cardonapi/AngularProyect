import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { SecurityService } from './security.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  isLoading = false;

  constructor(
    private afAuth: AngularFireAuth,
    private securityService: SecurityService,
    private router: Router
  ) { }

  /**
   * Login con Google
   */
  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;

    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
      const userData = await this.afAuth.signInWithPopup(provider);
      console.log('Usuario de Google completo:', userData);

      // Acceder al usuario de Firebase correctamente
      const user = userData.user;
      if (!user) {
        throw new Error('No se pudo obtener información del usuario');
      }

      console.log('Photo URL:', user.photoURL);

      // Guardar la sesión con la estructura correcta
      this.securityService.saveSession({
        id: user.uid,
        token: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photo: user.photoURL || undefined,
        user: user
      });

      this.isLoading = false;
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${userData.user.displayName}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en Google Sign-In:', error);
      this.isLoading = false;

      let errorMessage = 'Error al iniciar sesión con Google';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Ventana cerrada antes de completar el inicio de sesión';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Solicitud cancelada';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 5000
      });
    }
  }

  /**
   * Login con GitHub
   */
  async loginWithGitHub(): Promise<void> {
    this.isLoading = true;

    const provider = new firebase.auth.GithubAuthProvider();

    try {
      const userData = await this.afAuth.signInWithPopup(provider);
      console.log('Usuario de GitHub completo:', userData);

      const user = userData.user;
      if (!user) {
        throw new Error('No se pudo obtener información del usuario');
      }

      // GitHub puede tener el nombre en additionalUserInfo o providerData
      const githubProfile = (userData as any).additionalUserInfo?.profile;
      const githubName = githubProfile?.name || 
                        githubProfile?.login || 
                        user.displayName || 
                        user.email?.split('@')[0] || 
                        'Usuario';

      console.log('Nombre de GitHub extraído:', githubName);
      console.log('Photo URL de GitHub:', user.photoURL);

      this.securityService.saveSession({
        id: user.uid,
        token: user.uid,
        name: githubName,
        email: user.email || '',
        photo: user.photoURL || undefined,
        user: user
      });

      this.isLoading = false;
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${githubName}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en GitHub Sign-In:', error);
      this.isLoading = false;

      let errorMessage = 'Error al iniciar sesión con GitHub';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Ventana cerrada antes de completar el inicio de sesión';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Solicitud cancelada';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 5000
      });
    }
  }

  /**
   * Login con Microsoft
   */
  async loginWithMicrosoft(): Promise<void> {
    this.isLoading = true;

    const provider = new firebase.auth.OAuthProvider('microsoft.com');

    try {
      const userData = await this.afAuth.signInWithPopup(provider);
      console.log('Usuario de Microsoft completo:', userData);
      console.log('Additional User Info:', (userData as any).additionalUserInfo);

      const user = userData.user;
      if (!user) {
        throw new Error('No se pudo obtener información del usuario');
      }

      // Microsoft puede tener la foto en additionalUserInfo.profile
      const msProfile = (userData as any).additionalUserInfo?.profile;
      const photoUrl = user.photoURL || msProfile?.picture || undefined;

      console.log('Nombre de Microsoft:', user.displayName);
      console.log('Email de Microsoft:', user.email);
      console.log('Photo URL de Microsoft:', photoUrl);
      console.log('MS Profile:', msProfile);

      this.securityService.saveSession({
        id: user.uid,
        token: user.uid,
        name: user.displayName || user.email?.split('@')[0] || '',
        email: user.email || '',
        photo: photoUrl,
        user: user
      });

      this.isLoading = false;
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${user.displayName || 'Usuario'}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en Microsoft Sign-In:', error);
      this.isLoading = false;

      let errorMessage = 'Error al iniciar sesión con Microsoft';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Ventana cerrada antes de completar el inicio de sesión';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Solicitud cancelada';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 5000
      });
    }
  }
}