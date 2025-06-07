import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Bombo } from "../../../shared/components/bombo/bombo";
import { Tablero } from "../../../shared/components/tablero/tablero";
import { BingoService } from '../../../shared/services/bingo.service';
import { Fireworks } from 'fireworks-js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-bingo',
  imports: [Bombo, Tablero, CommonModule],
  templateUrl: './admin-bingo.html',
  styleUrl: './admin-bingo.css'
})
export class AdminBingo {
  bingoService = inject(BingoService)
  showResetModal = signal(false);
  showReviewModal = signal(false);
  @ViewChild('fireworksContainer', { static: true }) fireworksContainer!: ElementRef<HTMLDivElement>;
  fireworks: Fireworks | null = null;
  audio = new Audio('/Bingo/sounds/Fireworks-burst-sound.mp3');

  allNumbers = Array.from({ length: this.bingoService.numbersBingo }, (_, i) => i + 1);
  confirmReset() {
    this.bingoService.resetBalls();
    this.showResetModal.set(false);
  }
  showFireworks() {
    if (!this.fireworks) {
      this.fireworks = new Fireworks(this.fireworksContainer.nativeElement, {
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
