export interface GameConfig {
  gameMode: 'local-human-vs-human' | 'online-human-vs-human' | 'human-vs-ai';
  
  // null = unlimited
  whiteTimeSeconds: number | null;
  blackTimeSeconds: number | null;
  
  // Time increment per move in seconds (0-10)
  whiteIncrementSeconds: number;
  blackIncrementSeconds: number;
  
  // AI options for game mode 'human-vs-ai'
  aiSearchDepth?: number;
  aiModel?: string;

  whitePlayerType?: 'human' | 'ai';
  blackPlayerType?: 'human' | 'ai';
}
