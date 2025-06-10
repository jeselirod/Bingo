import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Home } from "../../../pages/home/home";

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);
  private router: Router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor() {
    // o después de un login exitoso.
   /*  this.authService.user$.subscribe(user => {
      if (user) {

        console.log('Usuario detectado o logueado, redirigiendo...');
        this.router.navigate(['/lobby']);
      } else {
        console.log('Ningún usuario logueado, mostrando opciones de login.');
      }
    }); */
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMessage = null; // Limpia errores previos
    try {
      await this.authService.loginWithGoogle();
      // La suscripción en el constructor manejará la redirección
    } catch (error: any) { // Usamos any para acceder a la propiedad 'code'
      console.error('Error en el componente al iniciar sesión con Google:', error);
      // Muestra un mensaje de error amigable al usuario
      // Puedes refinar estos mensajes según el código de error (error.code)
      this.errorMessage = `Error al iniciar sesión con Google: ${error.message}`;

      this.alertService.show(this.errorMessage, "error", 4000)
    }
  }

  async signUpWithEmail(): Promise<void> {
    this.errorMessage = null;
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa correo electrónico y contraseña para registrarte.';
      return;
    }
    try {
      await this.authService.signUpWithEmailAndPassword(this.email, this.password);
      // La suscripción manejará la redirección si es exitoso
    } catch (error: any) {
      console.error('Error en el componente al registrarse con Email/Password:', error);
      // Muestra errores específicos al usuario
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'El correo electrónico ya está registrado.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El formato del correo electrónico es inválido.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
          break;
        default:
          this.errorMessage = `Error al registrarse: ${error.message}`;
      }
      this.alertService.show(this.errorMessage, "error", 4000)
    }
  }

  async signInWithEmail(): Promise<void> {
    this.errorMessage = null; // Limpiamos cualquier error previo
    // Validamos que los campos no estén vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa correo electrónico y contraseña para iniciar sesión.';
      return; // Salimos del método si faltan datos
    }
    try {
      // Llamamos al método signInWithEmailAndPassword de nuestro AuthService
      await this.authService.signInWithEmailAndPassword(this.email, this.password);
      // Si el login es exitoso, la suscripción a user$ en el constructor
      // detectará el cambio de estado y manejará la redirección.
      console.log('Inicio de sesión con Email/Password completado (esperando redirección por suscripción)');
    } catch (error: any) {
      // Capturamos cualquier error que pueda ocurrir durante el proceso
      console.error('Error en el componente al iniciar sesión con Email/Password:', error);
      // Mostramos un mensaje de error más amigable al usuario basado en el código de error
      switch (error.code) {
        case 'auth/invalid-credential': // Este código se usa ahora para errores de credenciales incorrectas (email/password)
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
          break;
        case 'auth/user-disabled':
          this.errorMessage = 'Este usuario ha sido deshabilitado.';
          break;
        case 'auth/user-not-found': // Aunque 'invalid-credential' es más común, este puede ocurrir
          this.errorMessage = 'Usuario no encontrado.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El formato del correo electrónico es inválido.';
          break;
        default:
          // Para cualquier otro error no manejado específicamente
          this.errorMessage = `Error al iniciar sesión: ${error.message}`;
      }

      this.alertService.show(this.errorMessage, "error", 4000)
    }
  }

  async signInAnonymously(): Promise<void> {
    this.errorMessage = null; // Limpiamos cualquier error previo
    try {
      // Llamamos al método signInAnonymously de nuestro AuthService
      await this.authService.signInAnonymously();
      // Si el login anónimo es exitoso, la suscripción a user$ en el constructor
      // detectará el cambio de estado (ahora hay un usuario anónimo)
      // y manejará la redirección.
      console.log('Inicio de sesión anónimo completado (esperando redirección por suscripción)');
    } catch (error: any) {
      // Capturamos cualquier error que pueda ocurrir durante el proceso
      console.error('Error en el componente al iniciar sesión anónimo:', error);
      // Mostramos un mensaje de error genérico o específico si es necesario
      // Los errores en sign-in anónimo son menos comunes que en otros métodos.
      this.errorMessage = `Error al iniciar sesión como invitado: ${error.message}`;
      this.alertService.show(this.errorMessage, "error", 4000)
    }
  }

  async logout(): Promise<void> {
    this.errorMessage = null; // Limpiamos cualquier error previo al intentar cerrar sesión
    try {
      // Llamamos al método logout de nuestro AuthService
      await this.authService.logout();
      // El AuthService.user$ Observable emitirá 'null' después de un cierre de sesión exitoso.
      // La suscripción en el constructor de este componente (si la tienes)
      // o cualquier otro componente que esté suscrito a user$
      // puede reaccionar a este cambio (por ejemplo, redirigiendo de vuelta a la página de login).
      console.log('Cierre de sesión completado.');
      // Opcionalmente, si no tienes una suscripción global para redirigir,
      // podrías redirigir manualmente aquí después del await.
      // this.router.navigate(['/login']); // Ejemplo de redirección manual
    } catch (error: any) {
      // Capturamos cualquier error que pueda ocurrir durante el cierre de sesión
      console.error('Error en el componente al cerrar sesión:', error);
      // Mostramos un mensaje de error al usuario
      this.errorMessage = `Error al cerrar sesión: ${error.message}`;
      this.alertService.show(this.errorMessage, "error", 4000)
    }
  }
}
