import { Component, signal } from '@angular/core';
import { ChessBoardComponent } from './chess/components/chess-board/chess-board.component';

@Component({
  selector: 'app-root',
  imports: [ChessBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('deep-pelican-client');
}
