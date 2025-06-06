import { Routes } from '@angular/router';

export const routesBingo: Routes = [

  {
    path: '',
    loadComponent: () => import('./admin-bingo/admin-bingo').then(m => m.AdminBingo)
  }
];
