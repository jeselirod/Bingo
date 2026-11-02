import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BingoService } from '../../../services/bingo.service';
import { AlertService } from '../../services/alert.service';

import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: AuthService, useValue: { logout: jasmine.createSpy().and.resolveTo() } },
        { provide: AlertService, useValue: { show: jasmine.createSpy() } },
        {
          provide: BingoService,
          useValue: {
            remainingBalls: () => [],
            drawnNumbers: () => [],
            currentBall: () => null,
            resetBalls: jasmine.createSpy()
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
