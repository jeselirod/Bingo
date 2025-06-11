import { Routes } from '@angular/router';

export const routesBingo: Routes = [

  {
    path: 'admin/:id',
    loadComponent: () => import('./bingo/bingo').then(m => m.BingoComponent)
  },
  {
    path: 'invitado/:id',
    loadComponent: () => import('./bingo/bingo').then(m => m.BingoComponent)
  }
];
