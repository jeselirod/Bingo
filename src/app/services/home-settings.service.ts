import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export interface HomeContent {
  title: string;
  welcomeText: string;
  buttonText: string;
}

const OWNER_UID = 'PvfqPaZGldUNV2qRjVd4NeXmcri2';
const ADMIN_EMAIL_PATTERN = /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/;

@Injectable({ providedIn: 'root' })
export class HomeSettingsService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  readonly defaultHomeContent: HomeContent = {
    title: '¡Cumple J²!',
    welcomeText: 'Bienvenidos al Bingo del Cumple J² 🎉',
    buttonText: 'Empezar',
  };

  readonly homeContent$: Observable<HomeContent> = docData(
    doc(this.firestore, 'settings', 'home')
  ).pipe(
    map(content => {
      if (content === undefined) {
        return this.defaultHomeContent;
      }

      const { title, welcomeText, buttonText } = content;
      if (
        typeof title !== 'string'
        || typeof welcomeText !== 'string'
        || typeof buttonText !== 'string'
      ) {
        throw new Error('El documento settings/home no tiene el formato esperado.');
      }

      return { title, welcomeText, buttonText };
    })
  );

  readonly isOwner$: Observable<boolean> = this.authService.user$.pipe(
    map(user => this.isOwner(user))
  );

  readonly canEditHome$: Observable<boolean> = this.authService.user$.pipe(
    switchMap(user => {
      if (!user?.email || !user.emailVerified) {
        return of(false);
      }

      if (this.isOwner(user)) {
        return of(true);
      }

      return docData(doc(this.firestore, 'homeEditors', user.email))
        .pipe(map(grant => grant?.['email'] === user.email));
    })
  );

  readonly adminEmails$: Observable<string[]> = collectionData(
    collection(this.firestore, 'homeEditors')
  ).pipe(map(grants => grants.map(grant => {
    const email = grant['email'];
    if (typeof email !== 'string') {
      throw new Error('Un permiso de administrador no contiene un email válido.');
    }
    return email;
  })));

  async saveHomeContent(content: HomeContent): Promise<void> {
    await setDoc(doc(this.firestore, 'settings', 'home'), content);
  }

  async addAdmin(emailInput: string): Promise<void> {
    this.assertOwner();
    const email = emailInput.trim();

    if (!ADMIN_EMAIL_PATTERN.test(email)) {
      throw new Error('Introduce un email válido.');
    }

    if (email.toLowerCase() === this.authService.getCurrentUser()?.email?.toLowerCase()) {
      throw new Error('El propietario ya tiene permisos de edición.');
    }

    await setDoc(doc(this.firestore, 'homeEditors', email), { email });
  }

  async removeAdmin(email: string): Promise<void> {
    this.assertOwner();

    if (email.toLowerCase() === this.authService.getCurrentUser()?.email?.toLowerCase()) {
      throw new Error('No se pueden retirar los permisos del propietario.');
    }

    await deleteDoc(doc(this.firestore, 'homeEditors', email));
  }

  private isOwner(user: User | null): boolean {
    return user?.uid === OWNER_UID && user.emailVerified;
  }

  private assertOwner(): void {
    if (!this.isOwner(this.authService.getCurrentUser())) {
      throw new Error('Solo el propietario puede gestionar los permisos.');
    }
  }
}
