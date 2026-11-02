import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';
import { HomeSettingsService } from '../../services/home-settings.service';
import { HomeSettings } from './home-settings';

describe('HomeSettings', () => {
  let component: HomeSettings;
  let fixture: ComponentFixture<HomeSettings>;
  let saveHomeContent: jasmine.Spy;

  beforeEach(async () => {
    saveHomeContent = jasmine.createSpy().and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [HomeSettings],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: HomeSettingsService,
          useValue: {
            defaultHomeContent: {
              title: 'Título inicial',
              welcomeText: 'Bienvenida inicial',
              buttonText: 'Empezar'
            },
            homeContent$: of({
              title: 'Título inicial',
              welcomeText: 'Bienvenida inicial',
              buttonText: 'Empezar'
            }),
            isOwner$: of(true),
            adminEmails$: of([]),
            saveHomeContent,
            addAdmin: jasmine.createSpy().and.resolveTo(),
            removeAdmin: jasmine.createSpy().and.resolveTo()
          }
        },
        { provide: AlertService, useValue: { show: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the saved text into the form', () => {
    expect(component.homeForm.getRawValue()).toEqual({
      title: 'Título inicial',
      welcomeText: 'Bienvenida inicial',
      buttonText: 'Empezar'
    });
  });

  it('saves the edited home text', async () => {
    component.homeForm.controls.title.setValue('Nuevo título');

    await component.saveHomeContent();

    expect(saveHomeContent).toHaveBeenCalledWith({
      title: 'Nuevo título',
      welcomeText: 'Bienvenida inicial',
      buttonText: 'Empezar'
    });
  });
});
