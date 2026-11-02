import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../services/auth.service';
import { BingoService } from '../../../services/bingo.service';

import { Players } from './players';

describe('Players', () => {
  let component: Players;
  let fixture: ComponentFixture<Players>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Players],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: {} },
        {
          provide: BingoService,
          useValue: {
            players: () => ({}),
            creatorId: () => undefined
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Players);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
