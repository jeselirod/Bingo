import { Component, computed, inject } from '@angular/core';
import { BingoService } from '../../../services/bingo.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { KeyValuePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-players',
  imports: [KeyValuePipe],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class Players {
  authService = inject(AuthService);
  bingoService = inject(BingoService);
  players = computed(() => this.bingoService.players());
  totalPlayers = computed(() => {
    const players = this.players() || {};
    return Object.keys(players).length;
  });


}
