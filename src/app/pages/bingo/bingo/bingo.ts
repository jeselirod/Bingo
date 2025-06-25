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
    this.routeSub = this.route.paramMap.subscribe(params => {
    this.roomId  = params.get('id');
    this.isAdmin = this.router.url.includes('/admin/');
    if (!this.roomId) {
      this.router.navigate(['/lobby']);
      return;
    }
    if (this.isAdmin) {
      this.bingoService.createRoom(this.roomId);
    } else {
      this.bingoService.joinRoom(this.roomId);
    }
  });
}

  selectTab(tab: 'tablero' | 'orden' | 'players') {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.bingoService.removePlayerFromRoom(user.uid);
    }
  }



}
