import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Bombo } from "../../../shared/components/bombo/bombo";
import { Tablero } from "../../../shared/components/tablero/tablero";
import { BingoService } from '../../../services/bingo.service';

import { CommonModule } from '@angular/common';
import { Menu } from '../../../shared/components/menu/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Players } from '../../../shared/components/players/players';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-bingo',
  imports: [CommonModule, Menu, Bombo, Tablero, Players],
  templateUrl: './bingo.html',
  styleUrl: './bingo.css'
})
export class BingoComponent {

  selectedTab: 'tablero' | 'orden' | 'players' = 'tablero';
  route = inject(ActivatedRoute)
  router = inject(Router)
  bingoService = inject(BingoService)
  authService = inject(AuthService)
  alertService = inject(AlertService)
  isAdmin = false
  roomId!: string | null
  private routeSub!: Subscription;
  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async params => {
      this.roomId = params.get('id');
      this.isAdmin = this.router.url.includes('/admin/');
      if (!this.roomId) {
        this.router.navigate(['/lobby']);
        return;
      }
      if (this.isAdmin) {
        await this.bingoService.createRoom(this.roomId);
      } else {
        await this.bingoService.joinRoom(this.roomId);
      }
    });
  }

  selectTab(tab: 'tablero' | 'orden' | 'players') {
    this.selectedTab = tab;
  }

  async ngOnDestroy(): Promise<void> {
    this.routeSub.unsubscribe();
    this.bingoService.unsubscribe();
    const user = this.authService.getCurrentUser();
    if (user && this.roomId) {
      // 1. Limpia presencia en Realtime DB
      await this.bingoService.clearUserPresence(this.roomId, user.uid);

      // 2. (Opcional) elimina al jugador también de Firestore
      await this.bingoService.removePlayerFromRoom(user.uid);
    }
  }



}
