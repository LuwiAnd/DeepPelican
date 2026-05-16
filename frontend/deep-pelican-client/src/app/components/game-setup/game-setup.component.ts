import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GameConfig } from '../../shared/models/game-config';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnInit {
  gameMode: string = '';
  config: GameConfig = {
    gameMode: 'local-human-vs-human',
    whiteTimeSeconds: 300, // 5 minutes default
    blackTimeSeconds: 300,
    whiteIncrementSeconds: 0,
    blackIncrementSeconds: 0,
    aiSearchDepth: 4,
    aiModel: 'Minimax',
    whitePlayerType: 'human',
    blackPlayerType: 'human',
  };

  timeOptions = [
    { label: '30 seconds', seconds: 30 },
    { label: '1 minute', seconds: 60 },
    { label: '2 minutes', seconds: 120 },
    { label: '3 minutes', seconds: 180 },
    { label: '4 minutes', seconds: 240 },
    { label: '5 minutes', seconds: 300 },
    { label: '6 minutes', seconds: 360 },
    { label: '7 minutes', seconds: 420 },
    { label: '8 minutes', seconds: 480 },
    { label: '9 minutes', seconds: 540 },
    { label: '10 minutes', seconds: 600 },
    { label: 'Unlimited', seconds: null },
  ];

  // AI options
  aiModels = ['Random', 'Minimax', 'AlphaBeta'];
  aiSearchDepthOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gameMode = this.route.snapshot.paramMap.get('gameMode') || '';
    
    // Set gameMode in config
    if (
      this.gameMode === 'local-human-vs-human' ||
      this.gameMode === 'online-human-vs-human' ||
      this.gameMode === 'human-vs-ai'
    ) {
      this.config.gameMode = this.gameMode;
    }

    // Set AI defaults for human-vs-ai
    if (this.gameMode === 'human-vs-ai') {
      this.config.aiSearchDepth = 4;
      this.config.aiModel = 'Minimax';
      // Default player types: human vs AI
      this.config.whitePlayerType = 'human';
      this.config.blackPlayerType = 'ai';
    } else if (this.gameMode === 'online-human-vs-human') {
      // Online mode forces both to human
      this.config.whitePlayerType = 'human';
      this.config.blackPlayerType = 'human';
    } else if (this.gameMode === 'local-human-vs-human') {
      this.config.whitePlayerType = 'human';
      this.config.blackPlayerType = 'human';
    }
  }

  toggleWhitePlayer(): void {
    this.config.whitePlayerType = this.config.whitePlayerType === 'human' ? 'ai' : 'human';
  }

  toggleBlackPlayer(): void {
    this.config.blackPlayerType = this.config.blackPlayerType === 'human' ? 'ai' : 'human';
  }

  isLocal(): boolean {
    return this.gameMode === 'local-human-vs-human';
  }

  isOnline(): boolean {
    return this.gameMode === 'online-human-vs-human';
  }

  isHumanVsAi(): boolean {
    return this.gameMode === 'human-vs-ai';
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onStart(): void {
    this.router.navigate(['/chess', this.gameMode], {
      state: { config: this.config },
    });
  }

  getTimeLabel(seconds: number | null): string {
    if (seconds === null) return 'Unlimited';
    if (seconds < 60) return `${seconds}s`;
    return `${seconds / 60}m`;
  }

  // For online mode
  onWhiteTimeChangeOnline(newSeconds: number | null): void {
    this.config.whiteTimeSeconds = newSeconds;
    this.config.blackTimeSeconds = newSeconds;
  }

  // For online mode
  onWhiteIncrementChangeOnline(newIncrement: number): void {
    this.config.whiteIncrementSeconds = newIncrement;
    this.config.blackIncrementSeconds = newIncrement;
  }
}
