import { Routes } from '@angular/router';
import { adminMatchGuard } from '../../shared/guards/admin-guard';

export const routesBingo: Routes = [

  {
    path: 'admin/:id',
    loadComponent: () => import('./bingo/bingo').then(m => m.BingoComponent),
    canMatch: [adminMatchGuard]

  },
  {
    path: 'invitado/:id',
    loadComponent: () => import('./bingo/bingo').then(m => m.BingoComponent)
  }
];
