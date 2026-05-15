import { Routes } from '@angular/router';

import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
// import { ChessBoardComponent } from './chess/components/chess-board/chess-board.component';
import { ChessGameComponent } from './chess/components/chess-game/chess-game.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'chess',
        component: ChessGameComponent
      }
    ]
  }
];
