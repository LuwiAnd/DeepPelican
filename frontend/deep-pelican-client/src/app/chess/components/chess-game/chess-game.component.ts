import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChessBoardComponent } from '../chess-board/chess-board.component';

@Component({
  selector: 'app-chess-game',
  imports: [ChessBoardComponent],
  templateUrl: './chess-game.component.html',
  styleUrl: './chess-game.component.scss',
})
export class ChessGameComponent {
  public gameMode: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gameMode = this.route.snapshot.paramMap.get('gameMode');
    console.log('Game mode:', this.gameMode);
  }
}
