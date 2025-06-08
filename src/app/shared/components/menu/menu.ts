import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { BingoService } from '../../services/bingo.service';
import Fireworks from 'fireworks-js';
import { Tablero } from '../tablero/tablero';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  bingoService = inject(BingoService)
  showResetModal = signal(false);
  showReviewModal = signal(false);
  fireworksContainer = viewChild<ElementRef<HTMLDivElement>>('fireworksContainer')
  fireworks: Fireworks | null = null;
  audio = new Audio('/Bingo/sounds/Fireworks-burst-sound.mp3');
  isMobile = signal(false);
  showMenu = signal(true);

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

  drawnNumber() {
    return this.bingoService.drawnNumber();
  }
}
