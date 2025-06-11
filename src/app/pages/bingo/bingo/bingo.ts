import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Bombo } from "../../../shared/components/bombo/bombo";
import { Tablero } from "../../../shared/components/tablero/tablero";
import { BingoService } from '../../../services/bingo.service';
import { Fireworks } from 'fireworks-js';
import { CommonModule } from '@angular/common';
import { Menu } from '../../../shared/components/menu/menu';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-bingo',
  imports: [Menu, Bombo, Tablero, CommonModule],
  templateUrl: './bingo.html',
  styleUrl: './bingo.css'
})
export class BingoComponent {

  selectedTab: 'tablero' | 'orden' = 'tablero';
  route = inject(ActivatedRoute)
  router = inject(Router)
  bingoService = inject(BingoService)
  isAdmin = false
  roomId!: string | null
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('id');
      const fullUrl = this.router.url; // e.g. /admin-bingo/prueba
      this.isAdmin = fullUrl.includes('/admin/');

    });
  }

  selectTab(tab: 'tablero' | 'orden') {
    this.selectedTab = tab;
  }



}
