package app.laziji.gomoku.service;

import app.laziji.gomoku.model.ChessBoard;
import app.laziji.gomoku.model.Piece;

public interface GomokuService {

    Piece prediction(ChessBoard chessBoard, int calcDepth);

    Piece prediction(ChessBoard chessBoard);
}
