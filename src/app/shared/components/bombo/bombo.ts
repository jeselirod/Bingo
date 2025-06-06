import { Component, computed, inject, signal } from '@angular/core';
import { Bola } from '../bola/bola';
import { BingoService } from '../../services/bingo.service';

@Component({
  selector: 'app-bombo',
  imports: [Bola],
  templateUrl: './bombo.html',
  styleUrl: './bombo.css'
})
export class Bombo {
  bingoService = inject(BingoService)

  // Computed para contar cuántas bolas quedan
  remainingCount = computed(() => this.bingoService.remainingBalls().length);

  constructor() {

  }

  ngOnInit() {
    this.bingoService.resetBalls();
  }



}
