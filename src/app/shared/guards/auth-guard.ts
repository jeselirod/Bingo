import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService)
  const router = inject(Router)

 return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );

};
