import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface Alert {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  alerts$ = this.alertsSubject.asObservable();
  private counter = 0;

  show(message: string, type: Alert['type'] = 'info', duration = 3000) {
    const id = ++this.counter;
    const alert: Alert = { id, message, type };
    this.alertsSubject.next([...this.alertsSubject.value, alert]);

    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    this.alertsSubject.next(this.alertsSubject.value.filter(a => a.id !== id));
  }
}
