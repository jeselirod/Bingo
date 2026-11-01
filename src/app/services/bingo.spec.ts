import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Database } from '@angular/fire/database';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from './auth.service';
import { BingoService } from './bingo.service';

describe('BingoService', () => {
  let service: BingoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Firestore, useValue: {} },
        { provide: Database, useValue: {} },
        { provide: AlertService, useValue: {} },
        { provide: AuthService, useValue: { getCurrentUser: () => null } },
        { provide: Router, useValue: {} }
      ]
    });
    service = TestBed.inject(BingoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('keeps the final Firestore ball after the animation interval is stopped', () => {
    jasmine.clock().install();
    try {
      service['applyRoomState']({
        remainingBalls: [1, 2],
        drawnNumbers: [],
        currentBall: null,
        isAnimating: true
      });

      jasmine.clock().tick(service.intervalStep);

      service['applyRoomState']({
        remainingBalls: [1],
        drawnNumbers: [2],
        currentBall: 2,
        isAnimating: false
      });

      jasmine.clock().tick(service.intervalStep);

      expect(service.currentBall()).toBe(2);
      expect(service.isAnimating()).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
