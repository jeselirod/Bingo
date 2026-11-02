import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { BingoService } from '../../../services/bingo.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';

import { BingoComponent } from './bingo';

describe('BingoComponent', () => {
  let component: BingoComponent;
  let fixture: ComponentFixture<BingoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BingoComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        { provide: Router, useValue: { url: '', navigate: jasmine.createSpy() } },
        {
          provide: BingoService,
          useValue: {
            remainingBalls: () => [],
            drawnNumbers: () => [],
            currentBall: () => null,
            isAnimating: () => false,
            players: () => ({}),
            creatorId: () => undefined,
            numbersBingo: 90,
            intervalStep: 50,
            nextBall: jasmine.createSpy(),
            resetBalls: jasmine.createSpy(),
            createRoom: jasmine.createSpy().and.resolveTo(),
            joinRoom: jasmine.createSpy().and.resolveTo(true),
            unsubscribe: jasmine.createSpy()
          }
        },
        {
          provide: AuthService,
          useValue: {
            user$: of(null),
            getCurrentUser: () => null,
            logout: jasmine.createSpy().and.resolveTo()
          }
        },
        { provide: AlertService, useValue: { show: jasmine.createSpy() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
