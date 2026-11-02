import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../services/alert.service';

import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        {
          provide: AuthService,
          useValue: {
            loginWithGoogle: jasmine.createSpy(),
            signUpWithEmailAndPassword: jasmine.createSpy(),
            signInWithEmailAndPassword: jasmine.createSpy(),
            signInAnonymously: jasmine.createSpy(),
            logout: jasmine.createSpy()
          }
        },
        {
          provide: AlertService,
          useValue: { show: jasmine.createSpy() }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
