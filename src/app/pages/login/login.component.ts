import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseAuthService } from '../../shared/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  email = '';
  password = '';
  rememberMe = false;

  constructor(public firebaseAuthService: FirebaseAuthService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  /**
   * Login con Google
   */
  loginWithGoogle(): void {
    this.firebaseAuthService.loginWithGoogle();
  }

  /**
   * Login con GitHub
   */
  loginWithGitHub(): void {
    this.firebaseAuthService.loginWithGitHub();
  }

  /**
   * Login con Microsoft
   */
  loginWithMicrosoft(): void {
    this.firebaseAuthService.loginWithMicrosoft();
  }

  /**
   * Login con credenciales (temporal - sin implementar)
   */
  loginWithCredentials(): void {
    console.log('Login con credenciales:', { email: this.email, password: this.password });
    // TODO: Implementar login con credenciales
    alert('Login con credenciales no implementado aún. Usa Google, GitHub o Microsoft.');
  }

}
