import { Component, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../../services/spinner-service';
import { AsyncPipe } from '@angular/common';
import { Bola } from '../bola/bola';
import { BingoService } from '../../../services/bingo.service';

@Component({
  selector: 'app-spinner',
  imports: [AsyncPipe, Bola],
  templateUrl: './spinner-component.html',
  styleUrl: './spinner-component.css'
})
export class SpinnerComponent {

  spinnerService = inject(SpinnerService)
  bingoService = inject(BingoService)
  number = signal<number>(0)
  isLoading$: Observable<boolean> = this.spinnerService.isLoading$;
  private animationIntervalId: any = null;
  allBolas = Array.from({ length: this.bingoService.numbersBingo }, (_, i) => i + 1)
  constructor() {
    effect(() => {
      const isLoading = this.spinnerService.isLoading$.subscribe(value => {
        if (value) this.startAnimation();
        else this.stopAnimation();
      });
    });
  }


  private startAnimation() {
    if (this.animationIntervalId) return;
    this.animationIntervalId = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * this.allBolas.length);
      this.number.set(this.allBolas[randomIdx]);
    }, this.bingoService.intervalStep);
  }

  private stopAnimation() {
    clearInterval(this.animationIntervalId);
    this.animationIntervalId = null;
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }
}
