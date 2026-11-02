import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';
import { HomeSettingsService } from '../../services/home-settings.service';

@Component({
  selector: 'app-home-settings',
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './home-settings.html',
})
export class HomeSettings {
  private readonly homeSettingsService = inject(HomeSettingsService);
  private readonly alertService = inject(AlertService);

  readonly isOwner$ = this.homeSettingsService.isOwner$;
  readonly adminEmails$ = this.homeSettingsService.adminEmails$;
  readonly isSaving = signal(false);
  readonly isAddingAdmin = signal(false);
  readonly removingEmail = signal<string | null>(null);

  readonly homeForm = new FormGroup({
    title: new FormControl(this.homeSettingsService.defaultHomeContent.title, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    welcomeText: new FormControl(this.homeSettingsService.defaultHomeContent.welcomeText, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    buttonText: new FormControl(this.homeSettingsService.defaultHomeContent.buttonText, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly adminForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor() {
    this.homeSettingsService.homeContent$
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: content => this.homeForm.setValue(content),
        error: error => {
          console.error('Error al cargar los textos de la página de inicio:', error);
          this.alertService.show('No se pudieron cargar los textos de la página.', 'error');
        },
      });
  }

  async saveHomeContent(): Promise<void> {
    if (this.homeForm.invalid) {
      this.homeForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    try {
      await this.homeSettingsService.saveHomeContent(this.homeForm.getRawValue());
      this.alertService.show('Textos de la página actualizados.', 'success');
    } catch (error) {
      console.error('Error al guardar los textos de la página de inicio:', error);
      this.alertService.show('No se pudieron guardar los textos. Comprueba tus permisos e inténtalo de nuevo.', 'error');
    } finally {
      this.isSaving.set(false);
    }
  }

  async addAdmin(): Promise<void> {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.isAddingAdmin.set(true);
    try {
      await this.homeSettingsService.addAdmin(this.adminForm.controls.email.value);
      this.adminForm.reset();
      this.alertService.show('Permisos de edición concedidos.', 'success');
    } catch (error) {
      console.error('Error al conceder permisos de edición:', error);
      this.alertService.show('No se pudieron conceder los permisos. Comprueba el email y vuelve a intentarlo.', 'error');
    } finally {
      this.isAddingAdmin.set(false);
    }
  }

  async removeAdmin(email: string): Promise<void> {
    this.removingEmail.set(email);
    try {
      await this.homeSettingsService.removeAdmin(email);
      this.alertService.show(`Se han retirado los permisos de ${email}.`, 'success');
    } catch (error) {
      console.error('Error al retirar permisos de edición:', error);
      this.alertService.show('No se pudieron retirar los permisos. Inténtalo de nuevo.', 'error');
    } finally {
      this.removingEmail.set(null);
    }
  }
}
