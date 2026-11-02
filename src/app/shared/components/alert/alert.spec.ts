import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertService } from '../../services/alert.service';

import { AlertComponent } from './alert';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: AlertService,
          useValue: {
            alerts$: of([{
              id: 1,
              message: 'Partida creada',
              type: 'success'
            }])
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders alerts from the alert service', () => {
    expect(fixture.nativeElement.textContent).toContain('Partida creada');
  });
});
