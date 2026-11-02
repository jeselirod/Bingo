import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { homeEditorGuard } from './shared/guards/home-editor-guard';

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
    path: 'configuracion',
    loadComponent: () => import('./pages/home-settings/home-settings').then(m => m.HomeSettings),
    canMatch: [authGuard, homeEditorGuard]
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
