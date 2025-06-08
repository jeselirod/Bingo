import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Bombo } from "../../../shared/components/bombo/bombo";
import { Tablero } from "../../../shared/components/tablero/tablero";
import { BingoService } from '../../../shared/services/bingo.service';
import { Fireworks } from 'fireworks-js';
import { CommonModule } from '@angular/common';
import { Menu } from '../../../shared/components/menu/menu';

@Component({
  selector: 'app-admin-bingo',
  imports: [Menu,Bombo, Tablero, CommonModule],
  templateUrl: './admin-bingo.html',
  styleUrl: './admin-bingo.css'
})
export class AdminBingo {
  bingoService = inject(BingoService)
  showResetModal = signal(false);
  showReviewModal = signal(false);
  @ViewChild('fireworksContainer', { static: true }) fireworksContainer!: ElementRef<HTMLDivElement>;
  fireworks: Fireworks | null = null;
  audio = new Audio('/Bingo/sounds/Fireworks-burst-sound.mp3');





}
