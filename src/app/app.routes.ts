import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)

  },

  {
    path: 'admin-bingo',
    loadChildren: () => import('./pages/bingo/bingo.routes').then(m => m.routesBingo)
  }
];
