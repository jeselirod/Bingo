import { Component, inject, signal } from '@angular/core';
import { Bombo } from "../../../shared/components/bombo/bombo";
import { Tablero } from "../../../shared/components/tablero/tablero";
import { BingoService } from '../../../shared/services/bingo.service';

@Component({
  selector: 'app-admin-bingo',
  imports: [Bombo, Tablero],
  templateUrl: './admin-bingo.html',
  styleUrl: './admin-bingo.css'
})
export class AdminBingo {
  bingoService = inject(BingoService)
  showResetModal = signal(false);

  confirmReset() {
    this.bingoService.resetBalls();
    this.showResetModal.set(false);
  }
}
