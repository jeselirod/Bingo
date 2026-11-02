import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { HomeSettingsService } from '../../services/home-settings.service';
import { AlertService } from '../services/alert.service';

export const homeEditorGuard: CanMatchFn = () => {
  const homeSettingsService = inject(HomeSettingsService);
  const alertService = inject(AlertService);
  const router = inject(Router);

  return homeSettingsService.canEditHome$.pipe(
    take(1),
    map(canEdit => {
      if (canEdit) {
        return true;
      }

      alertService.show('No tienes permisos para editar la página de inicio.', 'warning');
      return router.parseUrl('/home');
    })
  );
};
