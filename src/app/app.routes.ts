import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)

  },
    {
    path: 'lobby',
    loadComponent: () => import('./pages/lobby/lobby').then(m => m.Lobby)

  },
  {
    path: 'admin-bingo/:id',
    loadChildren: () => import('./pages/bingo/bingo.routes').then(m => m.routesBingo)
  },
    {
    path: 'invitado-bingo/:id',
    loadChildren: () => import('./pages/bingo/bingo.routes').then(m => m.routesBingo)
  }
];
