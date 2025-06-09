import { Component, inject } from '@angular/core';
import { BingoService } from '../../shared/services/bingo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../shared/utils/form-utils';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css'
})
export class Lobby {
  formUtils = FormUtils;
  bingoService = inject(BingoService)
  router = inject(Router)
  activeTab: 'create' | 'join' = 'create';
  roomId: string = '';

  form: FormGroup = new FormGroup({
    roomId: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(this.formUtils.idRoomPattern)])
  })


  async createRoom() {
    this.checkForm()
    const roomId = this.form.get('roomId')?.value.trim();
    if (!roomId) return;
    this.router.navigate([`/admin-bingo/${roomId}`]); // Ajusta la ruta según tu estructura
  }

  joinRoom() {
    this.checkForm()
    const roomId = this.form.get('roomId')?.value.trim();
    if (!roomId) return;
    this.router.navigate([`/invitado-bingo/${roomId}`]); // Ajusta la ruta según tu estructura
  }

  checkForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
