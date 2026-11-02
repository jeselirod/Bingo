import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BingoService } from '../../../services/bingo.service';
import { SpinnerService } from '../../services/spinner-service';

import { SpinnerComponent } from './spinner-component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: SpinnerService, useValue: { isLoading$: of(false) } },
        { provide: BingoService, useValue: { numbersBingo: 90, intervalStep: 50 } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
