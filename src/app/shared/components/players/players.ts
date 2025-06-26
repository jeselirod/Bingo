import { Component, computed, inject } from '@angular/core';
import { BingoService } from '../../../services/bingo.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-players',
  imports: [],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class Players {
  authService = inject(AuthService);
  bingoService = inject(BingoService);
  players = computed(() => this.bingoService.players());
  creatorId = computed(() => this.bingoService.creatorId());
  /** Lista con flag isAdmin */
 playersList = computed(() => {
    const map = this.players() || {};

    // Construye el array con { uid, name, isAdmin }
    const list = Object.entries(map).map(([uid, name]) => ({
      uid,
      name,
      isAdmin: uid === this.creatorId()
    }));

    // Primero admin(es), luego el resto
    const admins = list.filter(p => p.isAdmin);
    const others = list.filter(p => !p.isAdmin);
    return [...admins, ...others];
  });
  totalPlayers = computed(() => this.playersList().length);


}
