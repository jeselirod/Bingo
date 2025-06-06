import { Component, input, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bola',
  imports: [],
  templateUrl: './bola.html',
  styleUrl: './bola.css'
})
export class Bola {
  number = input<number | null>(null);
}
