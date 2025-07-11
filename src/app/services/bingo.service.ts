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
  creatorId?: string;
}

import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';
import { AlertService } from '../shared/services/alert.service';
import { User } from 'firebase/auth';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Database, ref, set, onDisconnect, onValue, remove } from '@angular/fire/database';

export const bingoRoomConverter: FirestoreDataConverter<BingoRoom> = {
  toFirestore(room: BingoRoom): DocumentData {
    // Aquí defines qué campos guardas
    return {
      remainingBalls: room.remainingBalls,
      drawnNumbers: room.drawnNumbers,
      currentBall: room.currentBall,
      isAnimating: room.isAnimating,
      // Si no viene, lo omitimos
      ...(room.players != null && { players: room.players }),
      ...(room.creatorId != null && { creatorId: room.creatorId })
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
      creatorId: data['creatorId'] as string | undefined,
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
  creatorId = signal<string | undefined>(undefined);

  firestore = inject(Firestore)
  private db = inject(Database);
  alertService = inject(AlertService)
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.isAnimating()) this.animationBalls()
    });
  }

  // Crear sala nueva (admin)
  async createRoom(roomId: string) {
    this.roomId = roomId;

    const roomRef = doc(this.firestore, 'rooms', roomId);

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.alertService.show('Debes estar autenticado para crear una sala', 'error', 4000);
      this.router.navigate(['/home']);
      return
    }
    // Si ya existe, no la creamos de nuevo
    if (await this.existRoom(roomRef)) {
      await updateDoc(roomRef, { [`players.${currentUser.uid}`]: currentUser.displayName || currentUser.email || 'Anónimo' });
      this.listenRoom();
      await this.setUserPresence(roomId, currentUser.uid);
      this.listenPresenceChanges(roomId);
      return;
    }

    const initial: BingoRoom = {
      remainingBalls: Array.from({ length: this.numbersBingo }, (_, i) => i + 1),
      drawnNumbers: [],
      currentBall: null,
      isAnimating: false,
      creatorId: currentUser.uid,
    };

    await setDoc(roomRef, initial);
    await updateDoc(roomRef, { [`players.${currentUser.uid}`]: currentUser.displayName || currentUser.email || 'Anónimo' });
    this.listenRoom();
    await this.setUserPresence(roomId, currentUser.uid);
    this.listenPresenceChanges(roomId);

  }

  // Unirse a sala existente (admin o invitado)
  async joinRoom(roomId: string): Promise<boolean> {
    this.roomId = roomId;

    // Referencia al documento con converter
    const roomRef = doc(this.firestore, 'rooms', roomId).withConverter(bingoRoomConverter);

    // Comprobamos existencia
    if (!(await getDoc(roomRef)).exists()) {
      this.router.navigate(['/lobby'])
      this.alertService.show(`La sala con id ${this.roomId} no existe`, 'error', 4000);
      return false;
    }

    this.listenRoom();

    const user = this.authService.getCurrentUser();
    if (user) {
      // Añade a Firestore
      await updateDoc(roomRef, { [`players.${user.uid}`]: user.displayName || user.email || 'Anónimo' });
      // Marca presencia en Realtime DB
      await this.setUserPresence(roomId, user.uid);
      // Escucha cambios de presencia
      this.listenPresenceChanges(roomId);
    }
    return true
  }

  // Escucha real-time de Firestore
  listenRoom() {
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
          /** ← Actualizamos creatorId */
          this.creatorId.set(data.creatorId);
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

  async getRoom(roomId: string): Promise<any> {

    const roomRef = doc(this.firestore, 'rooms', roomId).withConverter(bingoRoomConverter);
    const snap = await getDoc(roomRef);

    return snap.data();
  }

  // 4️⃣ PRESENCIA en Realtime Database
  private async setUserPresence(roomId: string, userId: string) {
    const userRef = ref(this.db, `presence/${roomId}/${userId}`);
    await set(userRef, true);
    onDisconnect(userRef).remove();  // ← Se borra al desconectar
  }

  private listenPresenceChanges(roomId: string) {
    const presRef = ref(this.db, `presence/${roomId}`);
    onValue(presRef, async snap => {
      const present = snap.val() ? Object.keys(snap.val()) : [];
      const current = this.players();         // jugadores que Firestore tenía
      const updated: Record<string, string> = {};
      for (const uid of present) {
        updated[uid] = current[uid] || 'Anónimo';
      }
      // Sincroniza Firestore con sólo los presentes
      await updateDoc(doc(this.firestore, 'rooms', roomId), { players: updated });
    });
  }

  async clearUserPresence(roomId: string, userId: string) {
    const userRef = ref(this.db, `presence/${roomId}/${userId}`);
    await remove(userRef);
  }

  unsubscribe() {
    this.roomSub?.unsubscribe();
  }
}
