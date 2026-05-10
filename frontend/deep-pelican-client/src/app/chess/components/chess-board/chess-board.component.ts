import { Component } from '@angular/core';
import { Piece } from '../../logic/pieces/piece';
import { ChessBoard } from '../../logic/chess-board';
import { Color, FENChar, pieceImagePaths } from '../../logic/models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chess-board',
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  public pieceImagePaths = pieceImagePaths;
  private _chessBoard: ChessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this._chessBoard.chessBoardView;
  public get turnColor(): Color {
    return this._chessBoard.turnColor;
  }

  public isDarkSquare(x: number, y: number): boolean {
    return ChessBoard.isDarkSquare(x, y);
  }
}
