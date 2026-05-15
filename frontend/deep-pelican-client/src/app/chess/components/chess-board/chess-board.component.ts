import { Component } from '@angular/core';
import { Piece } from '../../logic/pieces/piece';
import { ChessBoard } from '../../logic/chess-board';
import { CheckedKing, Color, Coords, FENChar, pieceImagePaths } from '../../logic/models';
import { CommonModule } from '@angular/common';
import { SelectedSquare } from '../../logic/models';
import { PawnPromotionComponent } from '../pawn-promotion/pawn-promotion.component';
import { Pawn } from '../../logic/pieces/pawn';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-chess-board',
  imports: [CommonModule, PawnPromotionComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  public pieceImagePaths = pieceImagePaths;
  private _chessBoard: ChessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this._chessBoard.chessBoardView;
  private checkState: CheckedKing | null = this._chessBoard.kingChecked;

  public showPromotionDialog = false;
  public promotionCoords: Coords | null = null;
  public promotionColor: Color | null = null;

  constructor(private dialogService: DialogService) {}

  private checkGameState(): void {
    console.log('Checking game state:', {
      kingChecked: this._chessBoard.kingChecked,
      validMoves: this._chessBoard.findValidMoves(this._chessBoard.turnColor).size
    });
    
    if(this.isCheckMate()) {
      console.log('Checkmate detected!');
      this.dialogService.showMessage(
        `Check mate\u2003\u2014\u2003${this._chessBoard.turnColor === Color.White ? '0 - 1' : '1 - 0'}`, 
        `Check mate! ${this._chessBoard.turnColor === Color.White ? 'Black' : 'White'} wins!`
      );
    } else if(this.isStaleMate()) {
      console.log('Stalemate detected!');
      this.dialogService.showMessage(
        'Stale mate\u2003\u2014\u20031/2 - 1/2', 
        'Stale mate! The game is a draw.'
      );
    }
  }

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

  public isDarkSquare(x: number, y: number): boolean {
    return ChessBoard.isDarkSquare(x, y);
  }

  public isInCheck(): boolean {
    return this._chessBoard.isInCheck(this._chessBoard.turnColor);
  }

  public async selectSquare(x: number, y: number): Promise<boolean> {

    if (this.promotionPromise) {
      this.promotionPromise.resolve(null);
      this.promotionPromise = null;
      this.showPromotionDialog = false;
      this.selectedSquare = {piece: null, x: -1, y: -1};
      this.pieceValidMoves = [];
      return false;
    }

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
        const movedPiece = this._chessBoard.getPieceAt(
          {
            x: this.selectedSquare.x, 
            y: this.selectedSquare.y
          }
        );

        let promotionPiece: Piece | null = null;

        if (movedPiece instanceof Pawn && (y === 0 || y === 7)) {
          promotionPiece = await this.askForPromotionPiece(movedPiece.color);
          if (!promotionPiece) {
            return false;
          }
        }

        await this._chessBoard.movePiece( {x: this.selectedSquare.x, y: this.selectedSquare.y}, {x, y}, promotionPiece || undefined);
        this.chessBoardView = this._chessBoard.chessBoardView; // Update the view
        this.selectedSquare = {piece: null, x: -1, y: -1}; // Deselect after moving
        this.pieceValidMoves = [];
        
        
        
        this.checkGameState(); // Check for checkmate or stalemate
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

  public onPieceSelected(piece: Piece): void {
    if (this.promotionPromise) {
      this.showPromotionDialog = false;
      this.promotionPromise.resolve(piece);
      this.promotionPromise = null;
    }
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

  private isCheckMate(): boolean {
    return (
      this._chessBoard.kingChecked?.checked === true 
      && this._chessBoard.findValidMoves(this._chessBoard.turnColor).size === 0
    );
  }

  private isStaleMate(): boolean {
    return (
      this._chessBoard.kingChecked?.checked === false 
      && this._chessBoard.findValidMoves(this._chessBoard.turnColor).size === 0
    );
  }

  private promotionPromise: {
    resolve: (piece: Piece | null) => void;
    reject: () => void;
  } | null = null;

  private askForPromotionPiece(color: Color): Promise<Piece | null> {
    return new Promise((resolve) => {
      this.showPromotionDialog = true;
      this.promotionColor = color;
      this.promotionPromise = { resolve, reject: () => resolve(null) };
    });
  }
}
