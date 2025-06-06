import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BingoService {
  readonly numbersBingo = 90
  private remainingBallsSignal = signal<number[]>(Array.from({ length: this.numbersBingo }, (_, i) => i + 1));
  remainingBalls = this.remainingBallsSignal.asReadonly()

  private currentBallSignal = signal<number | null>(null);
  currentBall = this.currentBallSignal.asReadonly()

  private drawnNumberSignal = signal<number[]>([]);
  drawnNumber = this.drawnNumberSignal.asReadonly()

  private displayBallSignal = signal<number | null>(null);
  displayBall = this.displayBallSignal.asReadonly()

  private isAnimatingSignal = signal(false);
  isAnimating = this.isAnimatingSignal.asReadonly();

  private animationIntervalId: any = null;
  private animationDuration = 1000; // Duración total de la animación en ms
  private intervalStep = 50; // Cada 50ms cambia el número durante la animación


  constructor() { }

  resetBalls() {
    this.remainingBallsSignal.set(Array.from({ length: this.numbersBingo }, (_, i) => i + 1));
    this.drawnNumberSignal.set([])
    this.currentBallSignal.set(null);
    this.displayBallSignal.set(null);
  }

  nextBall() {
    if (this.isAnimatingSignal()) return;
    const remaining = this.remainingBallsSignal();
    if (remaining.length === 0) {
      alert('¡Se han acabado las bolas!');
      return;
    }

    this.isAnimatingSignal.set(true);
    // Elegimos una bola final random
    const finalIndex = Math.floor(Math.random() * remaining.length);
    const finalBall = remaining[finalIndex];

    const startTime = Date.now();
    this.animationIntervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= this.animationDuration) {
        // Fin de animación: mostramos la bola real y detenemos interval
        clearInterval(this.animationIntervalId);
        this.displayBallSignal.set(finalBall);
        this.currentBallSignal.set(finalBall);
        this.remainingBallsSignal.update(bolas => bolas.filter(num => num !== finalBall));
        this.drawnNumberSignal.update(bolas => [...bolas, finalBall]);
        this.isAnimatingSignal.set(false);
      } else {
        // Mientras dure la animación, mostraremos un número aleatorio
        const randomIdx = Math.floor(Math.random() * this.remainingBalls().length);
        this.displayBallSignal.set(this.remainingBalls()[randomIdx]);
      }
    }, this.intervalStep);
  }


}
