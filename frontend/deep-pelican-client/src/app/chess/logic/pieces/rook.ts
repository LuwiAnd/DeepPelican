import {FENChar, Coords, Color} from '../models';
import { Piece } from './piece';

export class Rook extends Piece {
    protected _unMoved: boolean = true;
    protected _FENChar: FENChar;
    protected _directions: Coords[] = [
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 0, y: -1}
    ];

    constructor(color: Color) {
        super(color);
        this._FENChar = color === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
    }

    public get unMoved(): boolean {
        return this._unMoved;
    }
    public set unMoved(value: boolean) {
        this._unMoved = value;
    }
}