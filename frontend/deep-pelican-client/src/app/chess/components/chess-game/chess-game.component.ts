import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { GameConfig } from '../../../shared/models/game-config';

@Component({
  selector: 'app-chess-game',
  imports: [ChessBoardComponent],
  templateUrl: './chess-game.component.html',
  styleUrl: './chess-game.component.scss',
})
export class ChessGameComponent implements OnInit {
  public gameMode: string | null = null;
  public gameConfig: GameConfig | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['config']) {
      this.gameConfig = navigation.extras.state['config'] as GameConfig;
      this.gameMode = this.gameConfig.gameMode;
    }

    const modeFromRoute = this.route.snapshot.paramMap.get('gameMode');
    if (modeFromRoute && !this.gameMode) {
      this.gameMode = modeFromRoute;
    }

    console.log('Game mode:', this.gameMode);
    console.log('Game config:', this.gameConfig);
  }
}
