import { Component, inject } from '@angular/core';
import { BingoService } from '../../shared/services/bingo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css'
})
export class Lobby {
  bingoService = inject(BingoService)
  router = inject(Router)
  activeTab: 'create' | 'join' = 'create';
  roomId: string = '';

  async createRoom() {
    const roomId = this.roomId.trim()
    if (!roomId) return;
    this.router.navigate([`/admin-bingo/${roomId}`]); // Ajusta la ruta según tu estructura
  }

  joinRoom() {
    const roomId = this.roomId.trim()
    if (!roomId) return;
    this.router.navigate([`/invitado-bingo/${roomId}`]); // Ajusta la ruta según tu estructura
  }
}
