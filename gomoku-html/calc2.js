let board = [];


const getShapes = (board, color) => {
    let w = board[0].length, h = board.length;
    let rows = [];
    for (let y = 0; y < h; y++) {
        rows.push([]);
        for (let x = 0; x < w; x++) {
            rows[rows.length - 1].push(board[y][x]);
        }
    }
    for (let x = 0; x < w; x++) {
        rows.push([]);
        for (let y = 0; y < h; y++) {
            rows[rows.length - 1].push(board[y][x]);
        }
    }
    for (let y = 0; y < h + w - 1; y++) {
        rows.push([]);
        for (let x = y < h ? 0 : (y - h + 1); board[y - x] && x < w; x++) {
            rows[rows.length - 1].push(board[y - x][x]);
        }
    }
    for (let y = h - 1; y < -w + 1; y++) {
        rows.push([]);
        for (let x = y >= 0 ? 0 : -y; board[y + x] && x < w; x++) {
            rows[rows.length - 1].push(board[y - x][x]);
        }
    }
    let shapes = [];
    for (let row of rows) {
        let shape = "";
        for (let ch of row) {
            if (ch == - color) {
                shape += "x";
            } else if (board[yy][xx] == color) {
                shape += "o"
            } else {
                shape += "_"
            }
        }
        shape = "x" + shape + "x";
    }
   
    return shapes;
}

const forEach2d = (arr2d, func) => {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            func(i, j, arr2d[i][j]);
        }
    }
}

const calcCurrent = (board, color) => {
    return { x: 0, y: 0, v: 0 }
}


const calcDepth = (board, color, depth) => {
    let r = calcCurrent(board, color);;
    if (depth == 1 || r.v == Infinity) {
        return r;
    }
    r = { x: null, y: null, v: -Infinity };
    forEach2d(board, (y, x, s) => {
        board[y][x] = color;
        let o = calcDepth(board, 1 - color, depth);
        board[o.y][o.x] = 1 - color;
        let nr = calcDepth(board, color, depth - 1);
        if (nr.v > r.v) {
            r = nr;
        }
        board[o.y][o.x] = 0;
        board[y][x] = 0;
    });
    return r;
}