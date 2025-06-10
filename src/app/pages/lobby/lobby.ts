import { Component, inject } from '@angular/core';
import { BingoService } from '../../services/bingo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../shared/utils/form-utils';
import { Menu } from "../../shared/components/menu/menu";
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css'
})
export class Lobby {
  formUtils = FormUtils;
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);
  bingoService = inject(BingoService)
  router = inject(Router)
  activeTab: 'create' | 'join' = 'create';

  form: FormGroup = new FormGroup({
    roomId: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(this.formUtils.idRoomPattern)])
  })


  async createRoom() {
    this.checkForm()
    const roomId = this.form.get('roomId')?.value.trim();
    if (!roomId) return;
    this.bingoService.createRoom(roomId);
    this.router.navigate([`/admin-bingo/${roomId}`]); // Ajusta la ruta según tu estructura
  }

  joinRoom() {
    this.checkForm()
    const roomId = this.form.get('roomId')?.value.trim();
    if (!roomId) return;
    this.bingoService.joinRoom(roomId).then(r => {
      if (r) this.router.navigate([`/invitado-bingo/${roomId}`]);


    })
  }

  checkForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

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
      this.router.navigate(['/home']); // Ejemplo de redirección manual
    } catch (error: any) {
      // Capturamos cualquier error que pueda ocurrir durante el cierre de sesión
      console.error('Error en el componente al cerrar sesión:', error);
      // Mostramos un mensaje de error al usuario

      this.alertService.show(`Error al cerrar sesión: ${error.message}`, "error", 4000)
    }
  }
}
