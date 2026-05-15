import {FENChar, Coords, Color, ValidMoves, CheckedKing} from './models';
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
    private _validMoves: ValidMoves = new Map<string, Coords[]>();
    private _kingChecked: CheckedKing | null = null;
    private _lastMoveFrom: Coords | null = null;
    private _lastMoveTo: Coords | null = null;

    constructor() {
        this._chessBoard = this.initializeChessBoard();
        this._validMoves = this.findValidMoves(this._turnColor);
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

    public get validMoves(): ValidMoves {
        return this._validMoves;
    }

    public get turnColor(): Color {
        return this._turnColor;
    }

    public get chessBoardView(): (FENChar | null)[][] {
        return this._chessBoard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        });
    }

    public get kingChecked(): CheckedKing | null {
        return this._kingChecked;
    }

    public get lastMoveFrom(): Coords | null {
        return this._lastMoveFrom;
    }

    public get lastMoveTo(): Coords | null {
        return this._lastMoveTo;
    }

    public static isDarkSquare(x: number, y: number): boolean {
        return (x + y) % 2 === 0;
    }

    public isInCheck(color: Color): boolean {
        const kingPosition = this.findKing(color);
        if (!kingPosition) {
            throw new Error('King not found on the board');
        }

        const opponentColor = color === Color.White ? Color.Black : Color.White;

        return this.isThreatened(kingPosition, opponentColor);
    }

    private isThreatened(square: Coords, opponentColor: Color): boolean {
        // for (let i = 1; i < 8; i++) {
        //     if(
        //         square.y - i >= 0 
        //         && square.x - i >= 0 
        //         && (
        //             this._chessBoard[square.y - i][square.x - i] instanceof Bishop 
        //             ||
        //             this._chessBoard[square.y - i][square.x - i] instanceof Queen
        //         ) 
        //         && this._chessBoard[square.y - i][square.x - i]?.color === opponentColor
        //     ) 
        //     {
        //         return true;
        //     }else if(
        //         square.y - i < 0 
        //         || square.x - i < 0
        //         || this._chessBoard[square.y - i][square.x - i] !== null
        //     ) 
        //     {
        //         break;
        //     }
        // }
        // return false;

        const diagonalDirections: Coords[] = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];

        for (const direction of diagonalDirections) {
            if (
                this.isThreatenedInDirection(
                    square, 
                    direction, 
                    opponentColor, 
                    [Bishop, Queen]
                )
            ) 
            {
                return true;
            }
        }

        const straightDirections: Coords[] = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        for (const direction of straightDirections) {
            if (
                this.isThreatenedInDirection(
                    square, 
                    direction, 
                    opponentColor, 
                    [Rook, Queen]
                )
            ) 
            {
                return true;
            }
        }

        const knightMoves: Coords[] = [
            { x: 1, y: 2 },
            { x: 1, y: -2 },
            { x: -1, y: 2 },
            { x: -1, y: -2 },
            { x: 2, y: 1 },
            { x: 2, y: -1 },
            { x: -2, y: 1 },
            { x: -2, y: -1 }
        ];

        for (const move of knightMoves) {
            const x = square.x + move.x;
            const y = square.y + move.y;

            // Här kan jag behöva lägga till Tank (pjäs som går som 
            // ett torn + en springare) senare.
            if (
                this.isInsideBoard({ x, y }) 
                && this._chessBoard[y][x] instanceof Knight
                && this._chessBoard[y][x]?.color === opponentColor
            ) 
            {
                return true;
            }
        }

        if (this.isThreatenedByPawn(square, opponentColor)) {
            return true;
        }

        if(this.isThreatenedByKing(square, opponentColor)) {
            return true;
        }

        return false;
    }

    private findKing(color: Color): Coords | null {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this._chessBoard[y][x];
                if (piece instanceof King && piece.color === color) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    private isThreatenedInDirection(
        start: Coords,
        direction: Coords,
        opponentColor: Color,
        threateningTypes: Function[]
    ): boolean 
    {
        for (let i = 1; i < 8; i++) {
            const x = start.x + direction.x * i;
            const y = start.y + direction.y * i;

            if (!this.isInsideBoard({ x, y })) {
            return false;
            }

            const piece = this._chessBoard[y][x];

            if (piece === null) {
                continue;
            }

            if (
                piece.color === opponentColor &&
                threateningTypes.some(type => piece instanceof type)
            ) {
                return true;
            }

            return false;
        }

        return false;
    }

    private isInsideBoard(coords: Coords): boolean {
        return coords.x >= 0 && coords.x < 8 && coords.y >= 0 && coords.y < 8;
    }

    private isThreatenedByPawn(
        square: Coords, 
        opponentColor: Color
    ): boolean 
    {
        const direction = opponentColor === Color.White ? -1 : 1;
        const pawnAttacks: Coords[] = [
            { x: -1, y: direction },
            { x: 1, y: direction }
        ];

        for (const pa of pawnAttacks) {
            const x = square.x + pa.x;
            const y = square.y + pa.y;

            if (
                this.isInsideBoard({ x, y }) 
                && this._chessBoard[y][x] instanceof Pawn
                && this._chessBoard[y][x]?.color === opponentColor
            ) {
                return true;
            }
        }

        return false;
    }

    private isThreatenedByKing(
        square: Coords, 
        opponentColor: Color
    ): boolean {
        const kingPosition = this.findKing(opponentColor);

        if (!kingPosition) {
            throw new Error('Opponents king not found on the board');
        }

        const dx = Math.abs(square.x - kingPosition.x);
        const dy = Math.abs(square.y - kingPosition.y);

        if(
            !(dx === 0 && dy === 0)
            && dx <= 1
            && dy <= 1
        ) 
        {
            return true;
        }

        return false;
    }


    private isPositionValidAfterMove(
        piece: Piece,
        from: Coords, 
        to: Coords, 
        color: Color
    ): boolean 
    {
        const originalPiece = this._chessBoard[from.y][from.x];
        const targetPiece = this._chessBoard[to.y][to.x];

        // You can't capture your own pieces
        if(targetPiece && targetPiece.color === color) {
            return false;
        }
        // Temporarily make the move
        this._chessBoard[to.y][to.x] = piece;
        this._chessBoard[from.y][from.x] = null;

        const inCheck = this.isInCheck(piece.color);

        // Revert the move
        this._chessBoard[from.y][from.x] = originalPiece;
        this._chessBoard[to.y][to.x] = targetPiece;

        return !inCheck;
    }

    private isPositionValidAfterEnPassant(
        piece: Piece,
        from: Coords,
        to: Coords,
        color: Color
    ): boolean {
        const originalPiece = this._chessBoard[from.y][from.x];
        const targetPiece = this._chessBoard[from.y][to.x];

        // You can't capture your own pieces
        if(targetPiece && targetPiece.color === color) {
            return false;
        }
        
        // Temporarily make the move
        this._chessBoard[from.y][from.x] = null;
        this._chessBoard[to.y][to.x] = piece;
        this._chessBoard[from.y][to.x] = null; // Remove the captured pawn

        const inCheck = this.isInCheck(piece.color);

        // Revert the move
        this._chessBoard[from.y][from.x] = originalPiece;
        this._chessBoard[from.y][to.x] = targetPiece;
        this._chessBoard[to.y][to.x] = null;

        return !inCheck;
    }


    public findValidMoves(color: Color): ValidMoves {
        const validMoves: ValidMoves = new Map<string, Coords[]>();

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this._chessBoard[y][x];
                if (!piece || piece.color !== color) {
                    continue;
                }

                const pieceValidMoves = this.findValidMovesForPiece(piece, { x, y }); 
                if (pieceValidMoves.length > 0) {
                    validMoves.set(`${x},${y}`, pieceValidMoves);
                }
            }
        }

        return validMoves;
    }

    private findValidMovesForPiece(piece: Piece, from: Coords): Coords[] {
        const directions = piece.directions;
        const validMoves: Coords[] = [];

        for (const to of directions) {
            let newX = from.x + to.x;
            let newY = from.y + to.y;

            if(!this.isInsideBoard({ x: newX, y: newY })) {
                continue;
            }
            
            if( piece instanceof Knight) {
                if (this.isPositionValidAfterMove(piece, from, { x: newX, y: newY }, piece.color)) {
                    validMoves.push({ x: newX, y: newY });
                }
            }else if (piece instanceof King) {
                if (this.isPositionValidAfterMove(piece, from, { x: newX, y: newY }, piece.color)) {
                    validMoves.push({ x: newX, y: newY });
                }
                const opponentColor = piece.color === Color.White ? Color.Black : Color.White;
                // Short castling
                if(
                    piece.unMoved

                    && !this.isThreatened(
                        from, 
                        opponentColor)
                    && !this.isThreatened(
                        { x: from.x + 1, y: from.y }, 
                        opponentColor)
                    && !this.isThreatened(
                        { x: from.x + 2, y: from.y }, 
                        opponentColor)

                    && this._chessBoard[from.y][from.x + 1] === null
                    && this._chessBoard[from.y][from.x + 2] === null

                    && this._chessBoard[from.y][from.x + 3] instanceof Rook
                    && this._chessBoard[from.y][from.x + 3]?.color === piece.color
                    && (this._chessBoard[from.y][from.x + 3] as Rook).unMoved
                ) 
                {
                    validMoves.push({ x: from.x + 2, y: from.y });
                }
                // Long castling
                if(
                    piece.unMoved

                    && !this.isThreatened(
                        from, 
                        opponentColor)
                    && !this.isThreatened(
                        { x: from.x - 1, y: from.y }, 
                        opponentColor)
                    && !this.isThreatened(
                        { x: from.x - 2, y: from.y }, 
                        opponentColor)
                    
                    && this._chessBoard[from.y][from.x - 1] === null
                    && this._chessBoard[from.y][from.x - 2] === null
                    && this._chessBoard[from.y][from.x - 4] instanceof Rook
                    && this._chessBoard[from.y][from.x - 4]?.color === piece.color
                    && (this._chessBoard[from.y][from.x - 4] as Rook).unMoved
                ) {
                    validMoves.push({ x: from.x - 2, y: from.y });
                }
            } else if (piece instanceof Pawn) {
                if(to.x !== 0) {
                    // Diagonal move (capture)
                    if (
                        this.isInsideBoard({ x: newX, y: newY }) &&
                        this._chessBoard[newY][newX] !== null &&
                        this._chessBoard[newY][newX]?.color !== piece.color &&
                        this.isPositionValidAfterMove(piece, from, { x: newX, y: newY }, piece.color)
                    ) {
                        validMoves.push({ x: newX, y: newY });
                    }else if(
                        this.isInsideBoard({ x: newX, y: newY }) &&
                        this._chessBoard[newY][newX] === null 
                    ){
                        // En passant
                        const pieceOnSide = this._chessBoard[from.y][newX];
                        if (
                            pieceOnSide instanceof Pawn &&
                            pieceOnSide.color !== piece.color &&
                            pieceOnSide.isDoubleJumped &&
                            this.isPositionValidAfterEnPassant(piece, from, { x: newX, y: newY }, piece.color)
                        ) {
                            validMoves.push({ x: newX, y: newY });
                        }
                    }
                } else if(Math.abs(to.y) === 1) {
                    // Forward move
                    if (
                        this.isInsideBoard({ x: newX, y: newY }) &&
                        this._chessBoard[newY][newX] === null &&
                        this.isPositionValidAfterMove(piece, from, { x: newX, y: newY }, piece.color)
                    ) {
                        validMoves.push({ x: newX, y: newY });
                    }
                } else if(Math.abs(to.y) === 2) {
                    // Double jump
                    const intermediateY = from.y + (to.y / 2);
                    if (
                        this.isInsideBoard({ x: newX, y: newY }) &&
                        this._chessBoard[intermediateY][newX] === null &&
                        this._chessBoard[newY][newX] === null &&
                        this.isPositionValidAfterMove(piece, from, { x: newX, y: newY }, piece.color)
                    ) {
                        validMoves.push({ x: newX, y: newY });
                    }
                }
            } else {
                while (this.isInsideBoard({ x: newX, y: newY })) {
                    const obstaclePiece = this._chessBoard[newY][newX];

                    if (obstaclePiece && obstaclePiece.color === piece.color) {
                        break; // Can't move past your own piece
                    }

                    if (this.isPositionValidAfterMove(piece, from, { x: newX, y: newY }, piece.color)) {
                        validMoves.push({ x: newX, y: newY });
                    }

                    if (obstaclePiece) {
                        break; // Can't move past an opponent's piece
                    }

                    newX += to.x;
                    newY += to.y;
                }

            }


        }

        return validMoves;
    }

    public getPieceAt(coords: Coords): Piece | null {
        if (!this.isInsideBoard(coords)) {
            throw new Error('Coordinates are outside the board');
        }
        return this._chessBoard[coords.y][coords.x];
    }

    public async movePiece(from: Coords, to: Coords, promotionPiece?: Piece): Promise<void> {
        const piece = this.getPieceAt(from);
        if (!piece) {
            throw new Error('No piece at the source coordinates');
        }

        if (piece.color !== this._turnColor) {
            throw new Error('It is not this piece color\'s turn');
        }


        if (!this.isInsideBoard(to)) {
            throw new Error('Target coordinates are outside the board');
        }

        if (!this.isPositionValidAfterMove(piece, from, to, piece.color)) {
            throw new Error('Invalid move');
        }

        if (piece instanceof Pawn) {
            if(piece.directions.some(dir => dir.x === to.x - from.x && dir.y === to.y - from.y)) {
                if(
                    Math.abs(to.y - from.y) === 2 
                    && piece.unMoved 
                    && this._chessBoard[to.y][to.x] === null 
                    && this._chessBoard[from.y + (to.y - from.y) / 2][from.x] === null
                ) 
                {
                    piece.isDoubleJumped = true;
                    piece.unMoved = false;
                    this._chessBoard[to.y][to.x] = piece;
                    this._chessBoard[from.y][from.x] = null;
                    
                    this.updateAfterMove(piece, from, to, promotionPiece);
                    return;
                }else if(
                    Math.abs(to.y - from.y) === 1 
                    && to.x === from.x
                    && this._chessBoard[to.y][to.x] === null
                ) 
                {
                    piece.isDoubleJumped = false;
                    piece.unMoved = false;
                    this._chessBoard[to.y][to.x] = piece;
                    this._chessBoard[from.y][from.x] = null;

                    this.updateAfterMove(piece, from, to, promotionPiece);
                    return;
                }else if(
                    Math.abs(to.y - from.y) === 1 
                    && Math.abs(to.x - from.x) === 1
                    && this._chessBoard[to.y][to.x] !== null
                    && this._chessBoard[to.y][to.x]?.color !== piece.color
                ) {
                    piece.isDoubleJumped = false;
                    piece.unMoved = false;
                    this._chessBoard[to.y][to.x] = piece;
                    this._chessBoard[from.y][from.x] = null;

                    this.updateAfterMove(piece, from, to, promotionPiece);
                    return;
                }else if( // En passant
                    Math.abs(to.y - from.y) === 1 
                    && Math.abs(to.x - from.x) === 1
                    && this._chessBoard[to.y][to.x] === null
                    && this._chessBoard[from.y][to.x] instanceof Pawn
                    && this._chessBoard[from.y][to.x]?.color !== piece.color
                    && (this._chessBoard[from.y][to.x] as Pawn).isDoubleJumped
                ) {
                    piece.isDoubleJumped = false;
                    piece.unMoved = false;
                    this._chessBoard[to.y][to.x] = piece;
                    this._chessBoard[from.y][from.x] = null;
                    this._chessBoard[from.y][to.x] = null; // Remove the captured pawn
                    
                    this.updateAfterMove(piece, from, to, promotionPiece);
                    return;
                }else{
                    piece.isDoubleJumped = false;
                }
            } else{
                throw new Error('Invalid move for pawn');
            }
        }

        if(piece instanceof King ) {
            const opponentColor = piece.color === Color.White ? Color.Black : Color.White;
            // Short castling
            if(
                Math.abs(to.y - from.y) === 0 
                && to.x - from.x === 2
                && this._chessBoard[from.y][from.x + 1] === null
                && this._chessBoard[from.y][from.x + 2] === null
                && this._chessBoard[from.y][from.x + 3] instanceof Rook
                && this._chessBoard[from.y][from.x + 3]?.color === piece.color
                && piece.unMoved
                && (this._chessBoard[from.y][from.x + 3] as Rook).unMoved

                && !this.isThreatened(from, opponentColor)
                && !this.isThreatened({ x: from.x + 1, y: from.y }, opponentColor)
                && !this.isThreatened({ x: from.x + 2, y: from.y }, opponentColor)
            ) {
                this._chessBoard[from.y][from.x] = null;
                const rook = this._chessBoard[from.y][from.x + 3] as Rook;
                this._chessBoard[from.y][from.x + 1] = rook;
                this._chessBoard[to.y][to.x] = piece;
                this._chessBoard[from.y][from.x + 3] = null;
                rook.unMoved = false;
                piece.unMoved = false;

                this.updateAfterMove(piece, from, to, promotionPiece);
                return;
            // Long castling
            } else if(
                Math.abs(to.y - from.y) === 0 
                && to.x - from.x === -2
                && this._chessBoard[from.y][from.x - 1] === null
                && this._chessBoard[from.y][from.x - 2] === null
                && this._chessBoard[from.y][from.x - 3] === null
                && this._chessBoard[from.y][from.x - 4] instanceof Rook
                && this._chessBoard[from.y][from.x - 4]?.color === piece.color
                && piece.unMoved
                && (this._chessBoard[from.y][from.x - 4] as Rook).unMoved

                && !this.isThreatened(from, opponentColor)
                && !this.isThreatened({ x: from.x - 1, y: from.y }, opponentColor)
                && !this.isThreatened({ x: from.x - 2, y: from.y }, opponentColor)
            ) {
                this._chessBoard[from.y][from.x] = null;
                const rook = this._chessBoard[from.y][from.x - 4] as Rook;
                this._chessBoard[from.y][from.x - 1] = rook;
                this._chessBoard[to.y][to.x] = piece;
                this._chessBoard[from.y][from.x - 4] = null;
                rook.unMoved = false;
                piece.unMoved = false;
                
                this.updateAfterMove(piece, from, to, promotionPiece);
                return;
            } else if(
                Math.abs(to.x - from.x) <= 1 
                && Math.abs(to.y - from.y) <= 1
                && (to.x !== from.x || to.y !== from.y)
                && this.isPositionValidAfterMove(piece, from, to, piece.color)
            ) {
                this._chessBoard[from.y][from.x] = null;
                this._chessBoard[to.y][to.x] = piece;
                piece.unMoved = false;
                
                this.updateAfterMove(piece, from, to);
                return;
            } else {
                throw new Error('Invalid move for king');
            }
        }


        if (piece instanceof Knight) {
            const validKnightMoves = 
                piece.directions.map(dir => ({ x: from.x + dir.x, y: from.y + dir.y }))
                .filter(coords => this.isInsideBoard(coords));

            const isKnightMove = validKnightMoves.some(
                coords => coords.x === to.x && coords.y === to.y
            );

            if (
                isKnightMove &&
                this.isPositionValidAfterMove(piece, from, to, piece.color)
            ) {
                this._chessBoard[from.y][from.x] = null;
                this._chessBoard[to.y][to.x] = piece;
                
                this.updateAfterMove(piece, from, to);
                return;
            } else {
                throw new Error('Invalid move for knight');
            }
        }

        if (piece instanceof Bishop || piece instanceof Rook || piece instanceof Queen) {
            const isValidMove = piece.directions.some(dir => {
                let newX = from.x + dir.x;
                let newY = from.y + dir.y;

                while (this.isInsideBoard({ x: newX, y: newY })) {
                    if (newX === to.x && newY === to.y) {
                        return true;
                    }

                    if (this._chessBoard[newY][newX] !== null) {
                        return false;
                    }

                    newX += dir.x;
                    newY += dir.y;
                }

                return false;
            });

            if (
                isValidMove &&
                this.isPositionValidAfterMove(piece, from, to, piece.color)
            ) {
                this._chessBoard[from.y][from.x] = null;
                this._chessBoard[to.y][to.x] = piece;
                // this._turnColor = this._turnColor === Color.White ? Color.Black : Color.White;
                // this._validMoves = this.findValidMoves(this._turnColor);
                this.updateAfterMove(piece, from, to);
                return;
            } else {
                throw new Error('Invalid move for bishop, rook, or queen');
            }
        }
    }

    private updateAfterMove(piece: Piece, from: Coords, to: Coords, promotionPiece?: Piece): void {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const currentPiece = this._chessBoard[y][x];
                if(
                    currentPiece === piece
                    && from.x === to.x
                    && Math.abs(from.y - to.y) === 2
                ) {
                    continue;
                }
                if(currentPiece instanceof Pawn) 
                {
                    const pawn = this._chessBoard[y][x] as Pawn;
                    pawn.isDoubleJumped = false;
                }
            }
        }

        if (
            piece instanceof Pawn 
            && (to.y === 0 || to.y === 7)
            && promotionPiece
        )
        {
            this._chessBoard[to.y][to.x] = promotionPiece;
        }
        
        this._turnColor = this._turnColor === Color.White ? Color.Black : Color.White;
        this._validMoves = this.findValidMoves(this._turnColor);
        this.updateKingChecked(this._turnColor);
        this._lastMoveFrom = from;
        this._lastMoveTo = to;
    }

    public promotePawn(coords: Coords, newPiece: Piece): void {
        const piece = this.getPieceAt(coords);
        if (piece instanceof Pawn && (coords.y === 0 || coords.y === 7)) {
            this._chessBoard[coords.y][coords.x] = newPiece;
        }

        this._validMoves = this.findValidMoves(this._turnColor);
        this.updateKingChecked(this._turnColor);
    }

    private updateKingChecked(color: Color): void {
        const kingPosition = this.findKing(color);
        const opponentColor = color === Color.White ? Color.Black : Color.White;
        if (!kingPosition) {
            throw new Error('King not found on the board');
        }
        this._kingChecked = 
        { checked: this.isThreatened(kingPosition, opponentColor), 
            x: kingPosition.x, 
            y: kingPosition.y 
        };
    }
}