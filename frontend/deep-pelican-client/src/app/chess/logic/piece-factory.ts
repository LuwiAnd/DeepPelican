import { Piece } from './pieces/piece';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';
import { Bishop } from './pieces/bishop';
import { Knight } from './pieces/knight';
import { Color } from './models';

export class PieceFactory {
    static createPiece(type: string, color: Color): Piece {
        switch (type.toLowerCase()) {
            case 'queen':
                return new Queen(color);
            case 'rook':
                return new Rook(color);
            case 'bishop':
                return new Bishop(color);
            case 'knight':
                return new Knight(color);
            default:
                throw new Error(`Invalid piece type: ${type}`);
        }
    }
}