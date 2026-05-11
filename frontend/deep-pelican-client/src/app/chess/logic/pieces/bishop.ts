import {FENChar, Coords, Color} from '../models';
import {Piece} from './piece';

export class Bishop extends Piece {
    protected _FENChar: FENChar;
    protected _directions: Coords[] = [
        {x: 1, y: 1},
        {x: 1, y: -1},
        {x: -1, y: 1},
        {x: -1, y: -1}
    ];

    constructor(color: Color) {
        super(color);
        this._FENChar = color === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
    }

    // public getValidMoves(chessBoard: (Piece | null)[][], from: Coords): Coords[] {
    //     for (const direction of this.directions) {
    //         let newX = from.x + direction.x;
    //         let newY = from.y + direction.y;

    //         if(!isOnBoard)
    //     return [];
    // }
}