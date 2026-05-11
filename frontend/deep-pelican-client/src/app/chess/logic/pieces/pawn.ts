import {FENChar, Coords, Color} from '../models';
import { Piece } from './piece';

export class Pawn extends Piece {
    protected _isDoubleJumped: boolean = false;
    protected _unMoved: boolean = true;
    protected _FENChar: FENChar;
    protected _directions: Coords[] = [
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: -1, y: 1},
        {x: 1, y: 1}
    ];

    constructor(color: Color) {
        super(color);
        this._FENChar = color === Color.White ? FENChar.WhitePawn : FENChar.BlackPawn;
        if(color === Color.Black) {
            this.setBlackPawnDirections();
        }
    }

    public get isDoubleJumped(): boolean {
        return this._isDoubleJumped;
    }
    public set isDoubleJumped(value: boolean) {
        this._isDoubleJumped = value;
    }

    private setBlackPawnDirections() {
        if(this._color === Color.Black) {
            this._directions = this._directions.map(dir => ({x: dir.x, y: -dir.y}));
        }
    }

    public get unMoved(): boolean {
        return this._unMoved;
    }

    public set unMoved(value: boolean) {
        this._unMoved = value;

        if(!value) {
            this._directions = this._directions.filter(dir => !(dir.x === 0 && Math.abs(dir.y) === 2));
        }else{
            const doubleJumpDirection: Coords = {x: 0, y: this._color === Color.White ? 2 : -2};
            if(!this._directions.some(dir => dir.x === doubleJumpDirection.x && dir.y === doubleJumpDirection.y)) {
                this._directions.push(doubleJumpDirection);
            }
        }
    }

}