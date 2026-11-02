import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { HomeContent, HomeSettingsService } from '../../services/home-settings.service';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let user$: BehaviorSubject<boolean | null>;
  let canEditHome$: BehaviorSubject<boolean>;
  let homeContent$: BehaviorSubject<HomeContent | null>;

  beforeEach(async () => {
    user$ = new BehaviorSubject<boolean | null>(null);
    canEditHome$ = new BehaviorSubject(false);
    homeContent$ = new BehaviorSubject<HomeContent | null>(null);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user$,
            logout: jasmine.createSpy().and.resolveTo()
          }
        },
        {
          provide: HomeSettingsService,
          useValue: {
            homeContent$,
            canEditHome$,
            defaultHomeContent: {
              title: 'Título',
              welcomeText: 'Bienvenida',
              buttonText: 'Empezar'
            }
          }
        },
        { provide: AlertService, useValue: { show: jasmine.createSpy() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not show default text while home content is loading', () => {
    user$.next(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('shows the saved home content after it loads', () => {
    user$.next(true);
    homeContent$.next({
      title: 'Título guardado',
      welcomeText: 'Bienvenida guardada',
      buttonText: 'Entrar'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Título guardado');
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('does not show configuration controls to users without editor permissions', () => {
    expect(fixture.nativeElement.querySelector('[aria-controls="home-admin-controls"]')).toBeNull();
  });

  it('lets an editor show and hide the home configuration link', () => {
    user$.next(true);
    canEditHome$.next(true);
    fixture.detectChanges();

    const showButton = fixture.nativeElement.querySelector(
      'button[aria-label="Mostrar configuración"]'
    ) as HTMLButtonElement;
    expect(showButton).toBeTruthy();
    expect(showButton.getAttribute('aria-expanded')).toBe('false');

    showButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a[routerLink="/configuracion"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button[aria-label="Ocultar configuración"]')).toBeTruthy();

    const hideButton = fixture.nativeElement.querySelector(
      '#home-admin-controls button'
    ) as HTMLButtonElement;
    hideButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#home-admin-controls').classList).toContain('hidden');
  });
});
