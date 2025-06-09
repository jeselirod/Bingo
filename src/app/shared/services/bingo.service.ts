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
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

export interface BingoRoom {
  remainingBalls: number[];
  drawnNumbers: number[];
  currentBall: number | null;
  isAnimating: boolean;
}

import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';

const bingoRoomConverter: FirestoreDataConverter<BingoRoom> = {
  toFirestore(room: BingoRoom): DocumentData {
    // Aquí defines qué campos guardas
    return {
      remainingBalls: room.remainingBalls,
      drawnNumbers: room.drawnNumbers,
      currentBall: room.currentBall,
      isAnimating: room.isAnimating,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): BingoRoom {
    const data = snapshot.data();
    return {
      remainingBalls: data['remainingBalls'] as number[],
      drawnNumbers: data['drawnNumbers'] as number[],
      currentBall: data['currentBall'] as number | null,
      isAnimating: data['isAnimating'] as boolean,
    };
  }
};

@Injectable({ providedIn: 'root' })
export class BingoService {
  readonly numbersBingo = 90
  private animationDuration = 1000; // Duración total de la animación en ms
  private intervalStep = 50;
  private animationIntervalId: any = null;
  private roomId: string | null = null;
  private roomSub: Subscription | null = null;

  // Señales locales para la UI
  remainingBalls = signal<number[]>([]);
  drawnNumbers = signal<number[]>([]);
  currentBall = signal<number | null>(null);
  isAnimating = signal(false);

  firestore = inject(Firestore)

  constructor() {
    effect(() => {
      if (this.isAnimating()) this.animationBalls()
    });
  }

  // Crear sala nueva (admin)
  async createRoom(roomId: string) {
    this.roomId = roomId;

    const roomRef = doc(this.firestore, 'rooms', roomId);
    const existingRoom = await getDoc(roomRef);

    // Si ya existe, no la creamos de nuevo
    if (existingRoom.exists()) {
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
  joinRoom(roomId: string) {
    this.roomId = roomId;
    this.listenRoom();
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
}
