import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from './shared/components/dialog/dialog.component';
// import { ChessBoardComponent } from './chess/components/chess-board/chess-board.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('deep-pelican-client');
}
