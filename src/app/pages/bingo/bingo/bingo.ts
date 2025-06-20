import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Bombo } from "../../../shared/components/bombo/bombo";
import { Tablero } from "../../../shared/components/tablero/tablero";
import { BingoService } from '../../../services/bingo.service';
import { Fireworks } from 'fireworks-js';
import { CommonModule } from '@angular/common';
import { Menu } from '../../../shared/components/menu/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Players } from '../../../shared/components/players/players';
import { AuthService } from '../../../services/auth.service';

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
  isAdmin = false
  roomId!: string | null
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('id');
      const fullUrl = this.router.url; // e.g. /admin-bingo/prueba
      this.isAdmin = fullUrl.includes('/admin/');
      if (!this.roomId) {
        this.router.navigate(['/lobby']);
        return;
      }
      if (this.isAdmin) {
        this.bingoService.createRoom(this.roomId!);
      } else if (!this.isAdmin) {
        this.bingoService.joinRoom(this.roomId!)


      }
    })
  }

  selectTab(tab: 'tablero' | 'orden' | 'players') {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.bingoService.removePlayerFromRoom(user.uid);
    }
  }



}
