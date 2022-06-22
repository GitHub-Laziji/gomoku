package app.laziji.gomoku.service.impl;

import app.laziji.gomoku.model.ChessBoard;
import app.laziji.gomoku.model.Piece;
import app.laziji.gomoku.service.GomokuService;

public class DepthCalcGomokuServiceImpl implements GomokuService {

    @Override
    public Piece prediction(ChessBoard chessBoard, int calcDepth) {
        return null;
    }

    @Override
    public Piece prediction(ChessBoard chessBoard) {
        return null;
    }

    private int[][] assess(ChessBoard chessBoard, int calcDepth) {
        int[][] scoreGrid = new int[chessBoard.getWidth()][chessBoard.getWidth()];
        if (calcDepth == 1) {
            // TODO
        }
        Piece[][] pieces = chessBoard.getPieces();
        for (int i = 0; i < chessBoard.getWidth(); i++) {
            for (int j = 0; j < chessBoard.getWidth(); j++) {

            }
        }
        return scoreGrid;
    }

}
