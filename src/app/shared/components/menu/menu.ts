import { Component, ElementRef, HostListener, inject, input, signal, viewChild } from '@angular/core';
import { BingoService } from '../../../services/bingo.service';
import Fireworks from 'fireworks-js';
import { Tablero } from '../tablero/tablero';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { signOut, User } from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [Tablero, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  animations: [
    trigger('slideInOut', [
      state('closed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
      })),
      state('open', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden',
      })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class Menu {
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router)
  bingoService = inject(BingoService)
  showResetModal = signal(false);
  showReviewModal = signal(false);
  fireworksContainer = viewChild<ElementRef<HTMLDivElement>>('fireworksContainer')
  fireworks: Fireworks | null = null;
  audio = new Audio('/Bingo/sounds/Fireworks-burst-sound.mp3');
  isMobile = signal(false);
  showMenu = signal(true);
  onlyLogout = input<boolean>(false)

  ngOnInit() {
    this.updateView(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const w = (event.target as Window).innerWidth;
    this.updateView(w);
  }

  private updateView(width: number) {
    this.isMobile.set(width < 640);      // < sm
    this.showMenu.set(!this.isMobile())  // en desktop siempre visible
  }

  toggleMenu() {
    this.showMenu.update(value => !value)
  }
  confirmReset() {
    this.bingoService.resetBalls();
    this.showResetModal.set(false);
  }
  showFireworks() {
    if (!this.fireworks) {
      const containerRef = this.fireworksContainer();
      if (!containerRef) {
        console.error('Los fuegos artificales no estan disponibles.');
        return;
      }
      this.fireworks = new Fireworks(containerRef.nativeElement, {
        rocketsPoint: { min: 50, max: 50 },
        acceleration: 1.50,
        friction: 0.95,
        gravity: 1.5,
        particles: 1000,
        explosion: 20,
        boundaries: {
          width: window.innerWidth
        },
      });
    }

    this.fireworks.start();
    this.audio.currentTime = 0;  // Reiniciar el sonido
    this.audio.play();

    setTimeout(() => {
      this.fireworks?.stop();
      this.audio.pause();
    }, 7000);  // Duración de la animación y el sonido
  }

  openReview() {
    this.showReviewModal.set(true);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  }

  closeReview() {
    this.showReviewModal.set(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
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
