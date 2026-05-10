export enum Color{
    White,
    Black
}

export type Coords = {
    x: number;
    y: number;
};

export enum FENChar {
    WhitePawn = 'P',
    WhiteKnight = 'N',
    WhiteBishop = 'B',
    WhiteRook = 'R',
    WhiteQueen = 'Q',
    WhiteKing = 'K',
    BlackPawn = 'p',
    BlackKnight = 'n',
    BlackBishop = 'b',
    BlackRook = 'r',
    BlackQueen = 'q',
    BlackKing = 'k'
}

export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
    [FENChar.WhitePawn]: '/pieces/white_pawn.svg',
    [FENChar.WhiteKnight]: '/pieces/white_knight.svg',
    [FENChar.WhiteBishop]: '/pieces/white_bishop.svg',
    [FENChar.WhiteRook]: '/pieces/white_rook.svg',
    [FENChar.WhiteQueen]: '/pieces/white_queen.svg',
    [FENChar.WhiteKing]: '/pieces/white_king.svg',
    [FENChar.BlackPawn]: '/pieces/black_pawn.svg',
    [FENChar.BlackKnight]: '/pieces/black_knight.svg',
    [FENChar.BlackBishop]: '/pieces/black_bishop.svg',
    [FENChar.BlackRook]: '/pieces/black_rook.svg',
    [FENChar.BlackQueen]: '/pieces/black_queen.svg',
    [FENChar.BlackKing]: '/pieces/black_king.svg'
};