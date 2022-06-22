package app.laziji.gomoku.model;

public class ChessBoard implements Comparable<String> {


    private Piece[][] pieces;
    private Piece.Color currentColor = Piece.BLACK;
    private Piece.Color nextColor = Piece.WHITE;
    private int width;
    private int pieceTotal = 0;
    private boolean end = false;
    private Piece.Color winColor;

    private int pieceMinX;
    private int pieceMaxX;
    private int pieceMinY;
    private int pieceMaxY;

    public ChessBoard(int width) {
        this.pieces = new Piece[width][width];
        this.width = width;
        pieceMinX = pieceMinY = (width - 1) / 2;
        pieceMaxX = pieceMaxY = width / 2;
    }

    @Override
    public int compareTo(String o) {
        return 0;
    }

    public boolean put(Piece piece) {
        if (piece.getColor() != currentColor) {
            return false;
        }
        if (pieces[piece.getY()][piece.getX()] != null) {
            return false;
        }

        pieces[piece.getY()][piece.getX()] = piece;
        pieceTotal++;
        if (pieceTotal == width * width) {
            end = true;
        }
        int[] dx = {0, 0, 1, -1, 1, -1, 1, -1};
        int[] dy = {1, -1, 1, -1, 0, 0, -1, 1};
        int[] counts = {1, 1, 1, 1};
        for (int i = 0; i < 8; i++) {
            int x = piece.getX() + dx[i];
            int y = piece.getY() + dy[i];
            while (getPieceColor(x, y) == currentColor) {
                x += dx[i];
                y += dy[i];
                counts[i / 2]++;
            }
            if (counts[i / 2] >= 5) {
                end = true;
                winColor = currentColor;
            }
        }

        pieceMinX = Math.min(pieceMinX, piece.getX());
        pieceMaxX = Math.max(pieceMaxX, piece.getX());
        pieceMinY = Math.min(pieceMinY, piece.getY());
        pieceMaxY = Math.max(pieceMaxY, piece.getY());

        Piece.Color temp = currentColor;
        currentColor = nextColor;
        nextColor = temp;
        return true;
    }

    public boolean inBoard(int x, int y) {
        return x >= 0 && y >= 0 && x < width && y < width;
    }

    public Piece getPiece(int x, int y) {
        if (x < 0 || x >= width || y < 0 || y >= width) {
            return null;
        }
        return pieces[y][x];
    }

    public Piece.Color getPieceColor(int x, int y) {
        if (x < 0 || x >= width || y < 0 || y >= width) {
            return null;
        }
        Piece piece = pieces[y][x];
        if (piece == null) {
            return null;
        }
        return piece.getColor();
    }

    public int getPieceMinX() {
        return pieceMinX;
    }

    public int getPieceMaxX() {
        return pieceMaxX;
    }

    public int getPieceMinY() {
        return pieceMinY;
    }

    public int getPieceMaxY() {
        return pieceMaxY;
    }

    public int getPieceTotal() {
        return pieceTotal;
    }

    public boolean isEnd() {
        return end;
    }

    public Piece.Color getWinColor() {
        return winColor;
    }

    public int getWidth() {
        return width;
    }

    public Piece[][] getPieces() {
        return pieces;
    }

    public Piece.Color getCurrentColor() {
        return currentColor;
    }

    public Piece.Color getNextColor() {
        return nextColor;
    }
}
