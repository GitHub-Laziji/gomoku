package app.laziji.gomoku.model;

public class Piece {

    public static final Color BLACK = Color.BLACK;
    public static final Color WHITE = Color.WHITE;

    private int x;
    private int y;
    private Color color;

    public Piece() {

    }

    public Piece(int x, int y, Color color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Color getContrastColor() {
        if (color == BLACK) {
            return WHITE;
        }
        if (color == WHITE) {
            return BLACK;
        }
        return null;
    }

    @Override
    public String toString() {
        return "Piece{" +
                "x=" + x +
                ", y=" + y +
                ", color=" + color +
                '}';
    }

    public enum Color {
        BLACK, WHITE
    }
}
