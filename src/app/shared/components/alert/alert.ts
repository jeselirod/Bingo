import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class AlertComponent {
 alerts$!: Observable<Alert[]>;
 alertService = inject(AlertService)

  ngOnInit() {
    this.alerts$ = this.alertService.alerts$;
  }

  trackById(index: number, alert: Alert) {
    return alert.id;
  }
}
