import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { AsyncPipe } from '@angular/common';
import { LoginComponent } from '../../shared/components/login/login';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe, LoginComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);

  async logout(): Promise<void> {
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
      this.alertService.show(`Error al cerrar sesión: ${error.message}`, "error", 4000)
    }
  }
}
