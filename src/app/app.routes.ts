import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)

  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)

  },
  {
    path: 'lobby',
    loadComponent: () => import('./pages/lobby/lobby').then(m => m.Lobby),
    canMatch: [authGuard]

  },
  {
    path: 'bingo',
    loadChildren: () => import('./pages/bingo/bingo.routes').then(m => m.routesBingo),
    canMatch: [authGuard]
  },
  {
    path:'**',
    redirectTo: 'home'
  }
];
