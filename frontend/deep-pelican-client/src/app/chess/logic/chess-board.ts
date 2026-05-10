import {FENChar, Coords, Color} from './models';
import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import {Piece} from './pieces/piece';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';

export class ChessBoard {
    private _chessBoard: (Piece | null)[][];
    private _turnColor: Color = Color.White;

    constructor() {
        this._chessBoard = this.initializeChessBoard();
    }

    private initializeChessBoard(): (Piece | null)[][] {
        const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

        board[7][0] = new Rook(Color.Black);
        board[7][7] = new Rook(Color.Black);
        board[7][1] = new Knight(Color.Black);
        board[7][6] = new Knight(Color.Black);
        board[7][2] = new Bishop(Color.Black);
        board[7][5] = new Bishop(Color.Black);
        board[7][3] = new Queen(Color.Black);
        board[7][4] = new King(Color.Black);

        board[6][0] = new Pawn(Color.Black);
        board[6][1] = new Pawn(Color.Black);
        board[6][2] = new Pawn(Color.Black);
        board[6][3] = new Pawn(Color.Black);
        board[6][4] = new Pawn(Color.Black);
        board[6][5] = new Pawn(Color.Black);
        board[6][6] = new Pawn(Color.Black);
        board[6][7] = new Pawn(Color.Black);
        
        
        board[1][0] = new Pawn(Color.White);
        board[1][1] = new Pawn(Color.White);
        board[1][2] = new Pawn(Color.White);
        board[1][3] = new Pawn(Color.White);
        board[1][4] = new Pawn(Color.White);
        board[1][5] = new Pawn(Color.White);
        board[1][6] = new Pawn(Color.White);
        board[1][7] = new Pawn(Color.White);

        board[0][0] = new Rook(Color.White);
        board[0][7] = new Rook(Color.White);
        board[0][1] = new Knight(Color.White);
        board[0][6] = new Knight(Color.White);
        board[0][2] = new Bishop(Color.White);
        board[0][5] = new Bishop(Color.White);
        board[0][3] = new Queen(Color.White);
        board[0][4] = new King(Color.White);

        
        return board;
    }

    public get turnColor(): Color {
        return this._turnColor;
    }

    public get chessBoardView(): (FENChar | null)[][] {
        return this._chessBoard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        });
    }

    public static isDarkSquare(x: number, y: number): boolean {
        return (x + y) % 2 === 0;
    }
}
