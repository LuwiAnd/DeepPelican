import {FENChar, Coords, Color} from '../models';
import { Piece } from './piece';

export class Knight extends Piece {
    protected _FENChar: FENChar;
    protected _directions: Coords[] = [
        {x: 1, y: 2},
        {x: 1, y: -2},
        {x: -1, y: 2},
        {x: -1, y: -2},
        {x: 2, y: 1},
        {x: 2, y: -1},
        {x: -2, y: 1},
        {x: -2, y: -1}
    ];

    constructor(color: Color) {
        super(color);
        this._FENChar = color === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight;
    }
}