import { inject, Injectable } from '@angular/core';
import {
  CanMatchFn,
  Route,
  UrlSegment,
  Router
} from '@angular/router';
import { from, catchError, switchMap } from 'rxjs';
import { BingoService } from '../../services/bingo.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../services/alert.service';

export const adminMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const bingoService = inject(BingoService);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const router = inject(Router);

  // Asumimos ruta tipo 'bingo/admin/:id'
  const roomId = segments[segments.length - 1]?.path;
  const user = authService.getCurrentUser();

  if (!roomId || !user) {
    router.navigate(['/lobby']);
    return from([false]);
  }

  return from(bingoService.getRoom(roomId)).pipe(
    switchMap(room => {
      // Si no existe, o no tiene creatorId → primer creador
      if (!room || !room.creatorId) {
        return from([true]);
      }
      // Si coincide con el UID → mismo creador
      if (room.creatorId === user.uid) {
        return from([true]);
      }
      // Si no coincide → redirigir a invitado
      alertService.show(
        'Esta sala ya existe y tiene administrador. Accede como invitado.',
        'warning',
        4000
      );
     /*  router.navigate([`/bingo/invitado/${roomId}`]); */
      return from([false]);
    }),
    catchError(err => {
      console.error('Error en adminMatchGuard:', err);
      router.navigate(['/lobby']);
      return from([false]);
    })
  );
};
