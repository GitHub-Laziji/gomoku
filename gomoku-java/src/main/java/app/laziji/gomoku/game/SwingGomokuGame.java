package app.laziji.gomoku.game;

import app.laziji.gomoku.model.ChessBoard;
import app.laziji.gomoku.model.Piece;
import app.laziji.gomoku.service.GomokuService;
import app.laziji.gomoku.service.GomokuServiceFactory;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class SwingGomokuGame extends JFrame {

    private GomokuService gomokuService = GomokuServiceFactory.getInstance("situationalAssessment");

    private static final int L = 30;
    private boolean firstHand;
    private ChessBoard chessBoard;
    private ChessBoardPanel panel;

    public SwingGomokuGame(boolean firstHand) {
        this(15,firstHand);
    }

    public SwingGomokuGame(int width, boolean firstHand) {
        super();
        this.chessBoard = new ChessBoard(width);
        this.firstHand = firstHand;
        init();
        this.setVisible(true);
        this.pack();
    }

    private void init() {
        this.setTitle("Gomoku");
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setResizable(false);
        Container container = this.getContentPane();
        container.setLayout(new BorderLayout());
        JMenuBar menuBar = new JMenuBar();
        JMenu menu = new JMenu("开始游戏");
        JMenuItem item1 = new JMenuItem("玩家先(15路)");
        JMenuItem item2 = new JMenuItem("电脑先(15路)");
        menu.add(item1);
        menu.add(item2);
        menuBar.add(menu);
        this.setJMenuBar(menuBar);
        panel = new ChessBoardPanel(chessBoard);
        container.add(panel, BorderLayout.CENTER);

        if (!firstHand) {
            put(gomokuService.prediction(chessBoard));
        }
        panel.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if (chessBoard.isEnd()) {
                    return;
                }
                int x = e.getX() / L;
                int y = e.getY() / L;
                if (!put(new Piece(x, y, firstHand ? Piece.Color.BLACK : Piece.Color.WHITE))) {
                    return;
                }
                if (chessBoard.isEnd()) {
                    showEndDialog();
                    return;
                }
                Piece nextPiece = gomokuService.prediction(chessBoard);
                put(nextPiece);
                showEndDialog();
            }
        });
        item1.addActionListener(e -> {
            SwingGomokuGame.this.dispose();
            new SwingGomokuGame(15, true);
        });
        item2.addActionListener(e -> {
            SwingGomokuGame.this.dispose();
            new SwingGomokuGame(15, false);
        });

    }

    private boolean put(Piece piece) {
        if (!chessBoard.put(piece)) {
            return false;
        }
        panel.repaint();
        return true;
    }

    private void showEndDialog() {
        if (!chessBoard.isEnd()) {
            return;
        }
        if (chessBoard.getWinColor() == Piece.BLACK) {
            JOptionPane.showMessageDialog(null, "黑胜", "", JOptionPane.QUESTION_MESSAGE);
        } else if (chessBoard.getWinColor() == Piece.WHITE) {
            JOptionPane.showMessageDialog(null, "白胜", "", JOptionPane.QUESTION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null, "平局", "", JOptionPane.QUESTION_MESSAGE);
        }
    }


    private static class ChessBoardPanel extends JPanel {

        private ChessBoard chessBoard;

        private ChessBoardPanel(ChessBoard chessBoard) {
            this.chessBoard = chessBoard;
            this.setPreferredSize(new Dimension(L * chessBoard.getWidth(), L * chessBoard.getWidth()));
        }

        public void paint(Graphics g) {
            g.setColor(Color.ORANGE);
            g.fillRect(0, 0, this.getWidth(), this.getHeight());
            g.setColor(Color.BLACK);
            for (int i = 0; i < chessBoard.getWidth(); i++) {
                g.drawLine(i * L + L / 2, L / 2, i * L + L / 2, L * chessBoard.getWidth() - L / 2);
                g.drawLine(L / 2, i * L + L / 2, L * chessBoard.getWidth() - L / 2, i * L + L / 2);
            }
            if (chessBoard.getWidth() == 15) {
                g.setColor(Color.BLACK);
                g.fillArc(7 * L + L / 3, 7 * L + L / 3, L / 3, L / 3, 0, 360);
                g.fillArc(3 * L + L / 3, 3 * L + L / 3, L / 3, L / 3, 0, 360);
                g.fillArc(11 * L + L / 3, 3 * L + L / 3, L / 3, L / 3, 0, 360);
                g.fillArc(3 * L + L / 3, 11 * L + L / 3, L / 3, L / 3, 0, 360);
                g.fillArc(11 * L + L / 3, 11 * L + L / 3, L / 3, L / 3, 0, 360);
            }
            for (int i = 0; i < chessBoard.getWidth(); i++) {
                for (int j = 0; j < chessBoard.getWidth(); j++) {
                    if (chessBoard.getPieceColor(j, i) != null) {
                        g.setColor(chessBoard.getPieceColor(j, i) == Piece.BLACK ? Color.BLACK : Color.WHITE);
                        g.fillArc(j * L, i * L, L, L, 0, 360);
                    }
                }
            }
        }

        @Override
        public void update(Graphics g) {
            paint(g);
        }
    }
}
