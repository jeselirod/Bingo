// bingo.service.ts
import { effect, inject, Injectable, signal } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
  DocumentReference,
  deleteField,
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

export interface BingoRoom {
  remainingBalls: number[];
  drawnNumbers: number[];
  currentBall: number | null;
  isAnimating: boolean;
  players?: Record<string, string>;
}

import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';
import { AlertService } from '../shared/services/alert.service';
import { User } from 'firebase/auth';
import { AuthService } from './auth.service';

const bingoRoomConverter: FirestoreDataConverter<BingoRoom> = {
  toFirestore(room: BingoRoom): DocumentData {
    // Aquí defines qué campos guardas
    return {
      remainingBalls: room.remainingBalls,
      drawnNumbers: room.drawnNumbers,
      currentBall: room.currentBall,
      isAnimating: room.isAnimating,
      // Si no viene, lo omitimos
      ...(room.players != null && { players: room.players })
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): BingoRoom {
    const data = snapshot.data();
    return {
      remainingBalls: data['remainingBalls'] as number[],
      drawnNumbers: data['drawnNumbers'] as number[],
      currentBall: data['currentBall'] as number | null,
      isAnimating: data['isAnimating'] as boolean,
      players: (data['players'] as Record<string, string>) || {},
    };
  }
};

@Injectable({ providedIn: 'root' })
export class BingoService {
  readonly numbersBingo = 90
  readonly animationDuration = 1000; // Duración total de la animación en ms
  readonly intervalStep = 50;
  private animationIntervalId: any = null;
  private roomId: string | null = null;
  private roomSub: Subscription | null = null;

  // Señales locales para la UI
  remainingBalls = signal<number[]>([]);
  drawnNumbers = signal<number[]>([]);
  currentBall = signal<number | null>(null);
  isAnimating = signal(false);
  players = signal<Record<string, string>>({});

  firestore = inject(Firestore)
  alertService = inject(AlertService)
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.isAnimating()) this.animationBalls()
    });
  }

  // Crear sala nueva (admin)
  async createRoom(roomId: string) {
    this.roomId = roomId;

    const roomRef = doc(this.firestore, 'rooms', roomId);
    // Si ya existe, no la creamos de nuevo
    if (await this.existRoom(roomRef)) {
      console.log(`La sala ${roomId} ya existe.`);
      this.listenRoom(); // Podemos escucharla igualmente
      return;
    }

    const initial: BingoRoom = {
      remainingBalls: Array.from({ length: this.numbersBingo }, (_, i) => i + 1),
      drawnNumbers: [],
      currentBall: null,
      isAnimating: false,
    };
    await setDoc(doc(this.firestore, 'rooms', roomId), initial);
    this.listenRoom();
  }

  // Unirse a sala existente (admin o invitado)
  async joinRoom(roomId: string): Promise<boolean> {
    this.roomId = roomId;

    // Referencia al documento con converter
    const roomDocRef = doc(this.firestore, 'rooms', this.roomId)

    // Comprobamos existencia
    if (!await this.existRoom(roomDocRef)) {
      this.alertService.show(`La sala con id ${this.roomId} no existe`, 'error', 4000);
      return false;
    }

    this.listenRoom();

    // … después de this.listenRoom();
    // inyectamos y registramos al usuario en la sala
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      await this.addPlayerToRoom(currentUser);
    }

    return true
  }

  // Escucha real-time de Firestore
  private listenRoom() {
    if (!this.roomId) return;
    if (this.roomSub) this.roomSub.unsubscribe();

    const roomDoc = doc(this.firestore, 'rooms', this.roomId)
      .withConverter(bingoRoomConverter);

    this.roomSub = docData<BingoRoom>(roomDoc).subscribe(data => {
      if (data) {
        this.remainingBalls.set(data.remainingBalls);
        this.drawnNumbers.set(data.drawnNumbers);
        this.currentBall.set(data.currentBall);
        this.isAnimating.set(data.isAnimating);
        if (data.players) {
          this.players.set(data.players);
        }
      }


    });
  }

  // Lógica de sacar bola (solo admin)
  async nextBall() {
    if (this.isAnimating()) return;
    const remaining = this.remainingBalls();
    if (!this.roomId || remaining.length === 0) return;

    const finalIdx = Math.floor(Math.random() * remaining.length);
    const finalBall = remaining[finalIdx];

    // Marcamos animación en Firestore
    await updateDoc(doc(this.firestore, 'rooms', this.roomId), {
      isAnimating: true,
    });
    // Simulación de animación local (puedes mejorar con más señales)
    setTimeout(async () => {
      // Actualizamos estado real en Firestore
      await updateDoc(doc(this.firestore, 'rooms', this.roomId!), {
        currentBall: finalBall,
        remainingBalls: arrayRemove(finalBall),
        drawnNumbers: arrayUnion(finalBall),
        isAnimating: false,
      });
    }, this.animationDuration); // dura 1 s tu animación
  }

  async resetBalls() {
    if (!this.roomId) return;
    const initialState: BingoRoom = {
      remainingBalls: Array.from({ length: this.numbersBingo }, (_, i) => i + 1),
      drawnNumbers: [],
      currentBall: null,
      isAnimating: false,
    };

    const roomDoc = doc(this.firestore, 'rooms', this.roomId);
    await updateDoc(roomDoc, {
      remainingBalls: initialState.remainingBalls,
      drawnNumbers: initialState.drawnNumbers,
      currentBall: initialState.currentBall,
      isAnimating: initialState.isAnimating,
    });
  }

  private animationBalls() {
    const startTime = Date.now();
    this.animationIntervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= this.animationDuration) {
        clearInterval(this.animationIntervalId);
      } else {
        const randomIdx = Math.floor(Math.random() * this.remainingBalls().length);
        this.currentBall.set(this.remainingBalls()[randomIdx]);
      }
    }, this.intervalStep);
  }

  async existRoom(roomRef: DocumentReference<DocumentData, DocumentData>) {
    const existingRoom = await getDoc(roomRef);
    return existingRoom.exists()
    // Si ya existe, no la creamos de nuevo
  }
  /**
   * Añade el usuario autenticado a la lista de players de la sala
   */
  async addPlayerToRoom(user: User): Promise<void> {
    if (!this.roomId) return;

    const name = user.displayName
      || user.email
      || 'Anónimo';

    // Actualiza el campo "players.{uid}" en el doc de la sala
    const roomRef = doc(this.firestore, 'rooms', this.roomId);
    await updateDoc(roomRef, {
      [`players.${user.uid}`]: name
    });
  }

  async removePlayerFromRoom(uid: string): Promise<void> {
  if (!this.roomId) return;

  const roomRef = doc(this.firestore, 'rooms', this.roomId);
  // Marca el campo players.{uid} para borrado
  await updateDoc(roomRef, {
    [`players.${uid}`]: deleteField()
  });
}
}
