import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { BingoService } from '../../../services/bingo.service';

@Component({
  selector: 'app-tablero',
  imports: [CommonModule],
  templateUrl: './tablero.html',
  styleUrl: './tablero.css'
})
export class Tablero {
  bingoService = inject(BingoService)
  orden = input<boolean>(false)
  drawnNumbers = computed(() => this.bingoService.drawnNumbers())
  allNumbers = Array.from({ length: this.bingoService.numbersBingo }, (_, i) => i + 1)

  get cellSize(): string {
    return 'clamp(2rem, 4vw, 4rem)';
  }
}
