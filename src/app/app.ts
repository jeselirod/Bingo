import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AlertComponent } from "./shared/components/alert/alert";
import { SpinnerComponent } from "./shared/components/spinner-component/spinner-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Bingo';
}
