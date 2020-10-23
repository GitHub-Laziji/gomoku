package app.laziji.gomoku.service.impl;

import app.laziji.gomoku.model.ChessBoard;
import app.laziji.gomoku.model.Piece;
import app.laziji.gomoku.service.GomokuService;

import java.util.*;

public class SituationalAssessmentGomokuServiceImpl implements GomokuService {

    private static final int PL5 = 1300,
            PL4 = 1200,
            PD44 = 1200,
            PD4L3 = 1200,
            PL33 = 1100,
            PD3L3 = 1000,
            PD4 = 900,
            PXD4 = 800,
            PL3 = 700,
            PX3 = 600,
            PL22 = 500,
            PL2 = 400,
            PX2 = 300,
            PD3 = 200,
            PD2 = 100,
            PDD = 1;

    private static final Map<String, Integer> chessShapeMapping = new LinkedHashMap<>();

    static {
        chessShapeMapping.put("ooooo", 0);
        chessShapeMapping.put("_oooo_", 1);
        chessShapeMapping.put("_oooo", 2);
        chessShapeMapping.put("oooo_", 2);
        chessShapeMapping.put("ooo_o", 2);
        chessShapeMapping.put("o_ooo", 2);
        chessShapeMapping.put("oo_oo", 2);
        chessShapeMapping.put("_ooo__", 3);
        chessShapeMapping.put("__ooo_", 3);
        chessShapeMapping.put("_oo_o_", 3);
        chessShapeMapping.put("_o_oo_", 3);
        chessShapeMapping.put("ooo__", 4);
        chessShapeMapping.put("__ooo", 4);
        chessShapeMapping.put("oo_o_", 4);
        chessShapeMapping.put("_oo_o", 4);
        chessShapeMapping.put("oo__o", 4);
        chessShapeMapping.put("o__oo", 4);
        chessShapeMapping.put("o_o_o", 4);
        chessShapeMapping.put("_ooo_", 4);
        chessShapeMapping.put("__oo__", 5);
        chessShapeMapping.put("_o_o_", 5);
        chessShapeMapping.put("_o__o_", 5);
        chessShapeMapping.put("oo___", 6);
        chessShapeMapping.put("___oo", 6);
        chessShapeMapping.put("o_o__", 6);
        chessShapeMapping.put("__o_o", 6);
        chessShapeMapping.put("o__o_", 6);
        chessShapeMapping.put("_o__o", 6);
        chessShapeMapping.put("o___o", 6);
    }

    private Random random = new Random();

    @Override
    public Piece prediction(ChessBoard chessBoard, int calcDepth) {
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

    @Override
    public Piece prediction(ChessBoard chessBoard) {
        int[][] mySituation = new int[chessBoard.getWidth()][chessBoard.getWidth()];
        int[][] opponentSituation = new int[chessBoard.getWidth()][chessBoard.getWidth()];
        List<Piece> optionalMove = new ArrayList<>();
        int prevX = -1;
        int prevY = -1;
        for (int i = chessBoard.getPieceMinY() - 3; i <= chessBoard.getPieceMaxY() + 3; i++) {
            for (int j = chessBoard.getPieceMinX() - 3; j <= chessBoard.getPieceMaxX() + 3; j++) {
                if (!chessBoard.inBoard(j, i)) {
                    continue;
                }
                mySituation[i][j] = assess(new Piece(j, i, chessBoard.getCurrentColor()), chessBoard);
                opponentSituation[i][j] = assess(new Piece(j, i, chessBoard.getNextColor()), chessBoard);

                switch (comparativeScore(prevX, prevY, j, i, mySituation, opponentSituation, chessBoard.getWidth())) {
                    case 0:
                        optionalMove.add(new Piece(j, i, chessBoard.getCurrentColor()));
                        continue;
                    case 1:
                        prevX = j;
                        prevY = i;
                        optionalMove.clear();
                        optionalMove.add(new Piece(j, i, chessBoard.getCurrentColor()));
                    default:
                }
            }
        }
        return optionalMove.get(random.nextInt(optionalMove.size()));
    }

    private int assess(Piece piece, ChessBoard chessBoard) {
        int x = piece.getX(), y = piece.getY();
        if (chessBoard.getPiece(x, y) != null) {
            return 0;
        }
        int[] lineGrade = {0, 0, 0, 0, 0, 0, 0, 1};
        int bastGrade = 7;

        int[] dx = {0, 1, 1, 1,};
        int[] dy = {1, 1, 0, -1};
        for (int i = 0; i < 4; i++) {
            List<Piece.Color> pieceColors = new ArrayList<>();
            int nowX = x - 4 * dx[i];
            int nowY = y - 4 * dy[i];
            while (pieceColors.size() < 9) {
                nowX += dx[i];
                nowY += dy[i];
                if (pieceColors.size() == 3) {
                    pieceColors.add(piece.getColor());
                } else if (nowX < 0 || nowX >= chessBoard.getWidth() || nowY < 0 || nowY >= chessBoard.getWidth()) {
                    pieceColors.add(piece.getContrastColor());
                } else {
                    pieceColors.add(chessBoard.getPieceColor(nowX, nowY));
                }
            }
            String lineShape = parseShape(pieceColors, piece.getColor());
            for (Map.Entry<String, Integer> entry : chessShapeMapping.entrySet()) {
                if (lineShape.contains(entry.getKey())) {
                    lineGrade[entry.getValue()]++;
                    bastGrade = Math.min(bastGrade, entry.getValue());
                    break;
                }
            }
        }

        switch (bastGrade) {
            case 0:
                return PL5;
            case 1:
                return PL4;
            case 2:
                if (lineGrade[2] > 1 || lineGrade[3] >= 1)
                    return PD44;
                else
                    return PD4;
            case 3:
                if (lineGrade[3] > 1)
                    return PL33;
                else if (lineGrade[4] >= 1)
                    return PD3L3;
                else
                    return PL3;
            case 4:
                return PD3;
            case 5:
                if (lineGrade[5] > 1)
                    return PL22;
                else
                    return PL2;
            case 6:
                return PD2;
            case 7:
                return PDD;
            default:
                return 1;
        }
    }

    private String parseShape(List<Piece.Color> pieceColors, Piece.Color color) {
        StringBuilder shape = new StringBuilder();
        for (Piece.Color pieceColor : pieceColors) {
            if (pieceColor == color) {
                shape.append("o");
            } else if (pieceColor == null) {
                shape.append("_");
            } else {
                shape.append("x");
            }
        }
        return shape.toString();
    }

    private int comparativeScore(int prevX, int prevY, int x, int y,
                                 int[][] mySituation, int[][] opponentSituation, int width) {

        if (mySituation[y][x] == 0)
            return -1;
        if (prevX == -1)
            return 1;
        int myPrevScore = mySituation[prevY][prevX];
        int myNowScore = mySituation[y][x];
        int opponentPrevScore = opponentSituation[prevY][prevX];
        int opponentNowScore = opponentSituation[y][x];
        if (myPrevScore >= opponentPrevScore
                && (myNowScore > myPrevScore
                || opponentNowScore > myPrevScore
                || myNowScore == myPrevScore
                && opponentNowScore > opponentPrevScore)) {
            return 1;
        }

        if (opponentPrevScore > myPrevScore
                && (opponentNowScore > opponentPrevScore
                || myNowScore >= opponentPrevScore
                || opponentNowScore == opponentPrevScore
                && myNowScore > myPrevScore)) {
            return 1;
        }

        int center = width / 2;
        int prevCenter = Math.max(Math.abs(prevX - center), Math.abs(prevY - center));
        int nowCenter = Math.max(Math.abs(x - center), Math.abs(y - center));
        if (opponentPrevScore == opponentNowScore
                && myPrevScore == myNowScore
                && nowCenter < prevCenter) {
            return 1;
        }
        if (opponentPrevScore == opponentNowScore
                && myPrevScore == myNowScore
                && nowCenter == prevCenter) {
            return 0;
        }
        return -1;
    }
}