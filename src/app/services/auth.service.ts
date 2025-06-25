import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { SpinnerService } from '../shared/services/spinner-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user$: Observable<User | null> = authState(this.auth);
  spinnerService = inject(SpinnerService)
  constructor() {
    this.spinnerService.show()
    this.user$.subscribe(user => {
      this.spinnerService.hide()
      if (user) {
        console.log('Usuario logueado:', user.displayName);
      } else {
        console.log('Ningún usuario logueado');
      }
    });
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      // signInWithPopup abre una ventana emergente para el proceso de inicio de sesión
      await signInWithPopup(this.auth, provider);
      console.log('Inicio de sesión con Google exitoso');
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
      // Aquí puedes manejar errores específicos, por ejemplo:
      // if ((error as any).code === 'auth/popup-closed-by-user') {
      //   console.warn('El usuario cerró la ventana emergente');
      // }
      throw error; // O maneja el error de otra manera
    }
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      // createUserWithEmailAndPassword devuelve un UserCredential,
      // la propiedad 'user' contiene la información del usuario recién creado.
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registro con correo electrónico y contraseña exitoso');
      return userCredential.user; // Devuelve el objeto User
    } catch (error) {
      console.error('Error en el registro con correo electrónico y contraseña:', error);
      // Re-lanza el error para que el componente que llama pueda manejarlo
      throw error;
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      // signInWithEmailAndPassword también devuelve un UserCredential
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Inicio de sesión con correo electrónico y contraseña exitoso');
      return userCredential.user; // Devuelve el objeto User
    } catch (error) {
      console.error('Error en el inicio de sesión con correo electrónico y contraseña:', error);
      // Re-lanza el error para que el componente que llama pueda manejarlo
      throw error;
    }
  }

  async signInAnonymously(): Promise<User | null> {
    try {
      // signInAnonymously devuelve un UserCredential
      const userCredential = await signInAnonymously(this.auth);
      console.log('Inicio de sesión anónimo exitoso');
      return userCredential.user; // Devuelve el objeto User
    } catch (error) {
      console.error('Error en el inicio de sesión anónimo:', error);
      // Re-lanza el error
      throw error;
    }
  }
  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Cierre de sesión exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error; // O maneja el error
    }
  }

  // Opcional: Método para obtener el usuario actual de forma síncrona (puede ser null)
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }


}
