import { Component, OnDestroy, OnInit } from '@angular/core';
import { Piece } from '../../logic/pieces/piece';
import { ChessBoard } from '../../logic/chess-board';
import { CheckedKing, ChessMove, Color, Coords, FENChar, pieceImagePaths } from '../../logic/models';
import { CommonModule } from '@angular/common';
import { SelectedSquare } from '../../logic/models';
import { ChessRealtimeService } from '../../services/chess-realtime.service';

@Component({
  selector: 'app-chess-board',
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent implements OnInit, OnDestroy {
  private readonly gameId = 'default';
  public pieceImagePaths = pieceImagePaths;
  private _chessBoard: ChessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this._chessBoard.chessBoardView;
  private checkState: CheckedKing | null = this._chessBoard.kingChecked;

  public get turnColor(): Color {
    return this._chessBoard.turnColor;
  }

  public get validMoves(): Coords[] {
    if(this.selectedSquare && this.selectedSquare.piece) {
      const key = `${this.selectedSquare.x},${this.selectedSquare.y}`;
      return this._chessBoard.validMoves.get(key) || [];
    }
    return [];
  }

  private selectedSquare: SelectedSquare | null = {piece: null, x: -1, y: -1};
  private pieceValidMoves: Coords[] = [];

  constructor(private readonly realtimeService: ChessRealtimeService) {}

  public async ngOnInit(): Promise<void> {
    await this.realtimeService.connect(this.gameId);
    this.realtimeService.onMoveReceived(this.onRemoteMoveReceived);
  }

  public async ngOnDestroy(): Promise<void> {
    this.realtimeService.offMoveReceived(this.onRemoteMoveReceived);
    await this.realtimeService.disconnect();
  }

  public isDarkSquare(x: number, y: number): boolean {
    return ChessBoard.isDarkSquare(x, y);
  }

  public isInCheck(): boolean {
    return this._chessBoard.isInCheck(this._chessBoard.turnColor);
  }

  public selectSquare(x: number, y: number): boolean {
    const piece = this._chessBoard.getPieceAt({x, y});
    if(
      !piece && 
      !this.pieceValidMoves.some(
        move => move.x === x && move.y === y
      )
      || (
        piece 
        && piece.color !== this._chessBoard.turnColor
        && !this.pieceValidMoves.some(
          move => move.x === x && move.y === y
        )
      )
    ) {
      this.selectedSquare = {piece: null, x: -1, y: -1};
      this.pieceValidMoves = [];
      return false;
    }

    if(this.selectedSquare && this.selectedSquare.piece) {
      // If the same square is clicked again, deselect it
      if(this.selectedSquare.x === x && this.selectedSquare.y === y) {
        this.selectedSquare = {piece: null, x: -1, y: -1};
        this.pieceValidMoves = [];
        return false;
      }
      
      // If a different square is clicked and it's a valid move, move the piece
      if(this.pieceValidMoves.some(move => move.x === x && move.y === y)) {
        const move: ChessMove = {
          from: { x: this.selectedSquare.x, y: this.selectedSquare.y },
          to: { x, y }
        };

        this._chessBoard.movePiece(move.from, move.to);
        this.chessBoardView = this._chessBoard.chessBoardView; // Update the view
        this.selectedSquare = {piece: null, x: -1, y: -1}; // Deselect after moving
        this.pieceValidMoves = [];
        void this.sendMoveSafely(move);
        return true;
      }
    }

    
    if(piece && piece.color === this._chessBoard.turnColor) {
      this.selectedSquare = {piece: piece.FENChar, x, y};
      const key = `${x},${y}`;
      this.pieceValidMoves = this._chessBoard.validMoves.get(key) || [];
      return true;
    }

    
    return false;
  }

  public isSelectedSquare(x: number, y: number): boolean {
    if(!this.selectedSquare?.piece) return false;
    return this.selectedSquare?.x === x && this.selectedSquare?.y === y;
  }

  public isValidMove(x: number, y: number): boolean {
    return this._chessBoard.validMoves.get(`${this.selectedSquare?.x},${this.selectedSquare?.y}`)?.some(move => move.x === x && move.y === y) || false;
  }

  public isCheckedSquare(x: number, y: number): boolean {
    return (
      this._chessBoard.kingChecked !== null
      && this._chessBoard.kingChecked?.x === x
      && this._chessBoard.kingChecked?.y === y
      && this._chessBoard.kingChecked?.checked
    );
  }

  public isLastMove(x: number, y: number): boolean {
    return (
      this._chessBoard.lastMoveFrom !== null
      && this._chessBoard.lastMoveFrom.x === x
      && this._chessBoard.lastMoveFrom.y === y
    ) || (
      this._chessBoard.lastMoveTo !== null
      && this._chessBoard.lastMoveTo.x === x
      && this._chessBoard.lastMoveTo.y === y
    );
  }

  private onRemoteMoveReceived = (move: ChessMove): void => {
    try {
      this._chessBoard.movePiece(move.from, move.to);
      this.chessBoardView = this._chessBoard.chessBoardView;
      this.selectedSquare = { piece: null, x: -1, y: -1 };
      this.pieceValidMoves = [];
    } catch (error) {
      console.error('Failed to apply remote move', error);
    }
  };

  private async sendMoveSafely(move: ChessMove): Promise<void> {
    try {
      await this.realtimeService.sendMove(move);
    } catch (error) {
      console.error('Failed to send move', error);
    }
  }
}
