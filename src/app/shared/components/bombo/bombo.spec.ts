import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BingoService } from '../../../services/bingo.service';

import { Bombo } from './bombo';

describe('Bombo', () => {
  let component: Bombo;
  let fixture: ComponentFixture<Bombo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bombo],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: BingoService,
          useValue: {
            remainingBalls: () => [],
            currentBall: () => null,
            nextBall: jasmine.createSpy()
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bombo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
