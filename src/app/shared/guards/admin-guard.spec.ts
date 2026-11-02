import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BingoService } from '../../services/bingo.service';
import { AlertService } from '../services/alert.service';

import { adminMatchGuard } from './admin-guard';

describe('adminMatchGuard', () => {
  let getRoom: jasmine.Spy;
  let getCurrentUser: jasmine.Spy;
  let showAlert: jasmine.Spy;
  let navigate: jasmine.Spy;

  const executeGuard: CanMatchFn = (route, segments) =>
    TestBed.runInInjectionContext(() => adminMatchGuard(route, segments));

  async function runGuard(segments: UrlSegment[]): Promise<boolean> {
    const result = executeGuard({} as Route, segments);
    return result instanceof Observable
      ? firstValueFrom(result).then(guardResult => guardResult === true)
      : result === true;
  }

  beforeEach(() => {
    getRoom = jasmine.createSpy('getRoom').and.resolveTo(null);
    getCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue({ uid: 'admin-1' });
    showAlert = jasmine.createSpy('show');
    navigate = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: BingoService, useValue: { getRoom } },
        { provide: AuthService, useValue: { getCurrentUser } },
        { provide: AlertService, useValue: { show: showAlert } },
        { provide: Router, useValue: { navigate } }
      ]
    });
  });

  it('redirects to the lobby when the room id is missing', async () => {
    expect(await runGuard([])).toBeFalse();
    expect(navigate).toHaveBeenCalledWith(['/lobby']);
    expect(getRoom).not.toHaveBeenCalled();
  });

  it('allows access when the room has no administrator yet', async () => {
    getRoom.and.resolveTo(null);

    expect(await runGuard([new UrlSegment('room-1', {})])).toBeTrue();
    expect(getRoom).toHaveBeenCalledWith('room-1');
    expect(showAlert).not.toHaveBeenCalled();
  });

  it('denies access and warns when another user owns the room', async () => {
    getRoom.and.resolveTo({ creatorId: 'admin-2' });

    expect(await runGuard([new UrlSegment('room-1', {})])).toBeFalse();
    expect(showAlert).toHaveBeenCalledWith(
      'Esta sala ya existe y tiene administrador. Unete a ella o crea una nueva.',
      'warning',
      4000
    );
  });
});
