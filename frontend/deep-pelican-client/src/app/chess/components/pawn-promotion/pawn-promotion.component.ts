import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Piece } from '../../logic/pieces/piece';
import { PieceFactory } from '../../logic/piece-factory';
import { Color, FENChar, pieceImagePaths } from '../../logic/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pawn-promotion',
  imports: [CommonModule],
  templateUrl: './pawn-promotion.component.html',
  styleUrl: './pawn-promotion.component.scss',
})
export class PawnPromotionComponent {
  @Input() color!: Color;
  @Output() pieceSelected = new EventEmitter<Piece>();

  public pieceImagePaths = pieceImagePaths;

  private pieceTypes = ['queen', 'rook', 'bishop', 'knight'];

  public selectPiece(type: string): void {
    const piece = PieceFactory.createPiece(type, this.color);
    this.pieceSelected.emit(piece);
  }

  public getPieceImage(type: string): string {
    const fenChar = type === 'queen' ? 'q' : type === 'rook' ? 'r' : type === 'bishop' ? 'b' : 'n';
    const key = (this.color === Color.White ? fenChar.toUpperCase() : fenChar) as keyof typeof pieceImagePaths;
    return this.pieceImagePaths[key];
  }

  public cancelPromotion(): void {
    this.pieceSelected.emit(undefined as unknown as Piece);
  }
}