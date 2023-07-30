const P10 = (n) => Math.pow(10, n);

const SHAPE = {
    "ooooo": [Infinity, Infinity],

    //活4
    "_oooo_": [P10(9), P10(8)],

    //眠4
    "oooo_": [P10(8), P10(7)],
    "ooo_o": [P10(8), P10(7)],
    "oo_oo": [P10(8), P10(7)],
    "o_ooo": [P10(8), P10(7)],
    "_oooo": [P10(8), P10(7)],

    //活3
    "__ooo__": [P10(7.5), P10(6.5)],

    //半活3  先手能成活4
    "_ooo__": [P10(7), P10(6)],
    "_oo_o_": [P10(7), P10(6)],
    "_o_oo_": [P10(7), P10(6)],

    //眠3
    "ooo__": [P10(6), P10(5)],
    "oo_o_": [P10(6), P10(5)],
    "oo__o": [P10(6), P10(5)],
    "o_oo_": [P10(6), P10(5)],
    "o_o_o": [P10(6), P10(5)],
    "o__oo": [P10(6), P10(5)],
    "_ooo_": [P10(6), P10(5)],
    "_oo_o": [P10(6), P10(5)],
    "_o_oo": [P10(6), P10(5)],
    "__ooo": [P10(6), P10(5)],

    //活2
    "___oo___": [P10(5.5), P10(4.5)],

    //半活2
    "__oo___": [P10(5), P10(4)],
    "__o_o__": [P10(5), P10(4)],

    //眠2
    "_oo__": [P10(4), P10(3)],
    "__oo_": [P10(4), P10(3)],
    "_o_o_": [P10(4), P10(3)],
    "oo___": [P10(4), P10(3)],
    "o_o__": [P10(4), P10(3)],
    "o__o_": [P10(4), P10(3)],
    "o___o": [P10(4), P10(3)],
    "_o__o": [P10(4), P10(3)],
    "__o_o": [P10(4), P10(3)],
    "___oo": [P10(4), P10(3)],

    //活1
    "____o____": [P10(3), P10(2)],

    //眠1
    "__o__": [P10(2), P10(1)],
    "_o___": [P10(2), P10(1)],
    "___o_": [P10(2), P10(1)],
    "o____": [P10(2), P10(1)],
    "____o": [P10(2), P10(1)],
}

let board = [];

const initBoard = (w) => {
    board = [];
    for (let i = 0; i < w; i++) {
        let row = [];
        for (let j = 0; j < w; j++) {
            row[j] = 0;
        }
        board[i] = row;
    }
}

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
    let shapes0 = [];
    let shapes1 = [];
    for (let row of rows) {
        let shape0 = "";
        let shape1 = "";
        for (let ch of row) {
            if (ch == - color) {
                shape0 += "x";
                shape1 += "o";
            } else if (board[yy][xx] == color) {
                shape0 += "o";
                shape1 += "x";
            } else {
                shape0 += "_";
                shape1 += "_";
            }
        }
        shape0 = "x" + shape0 + "x";
        shape1 = "x" + shape1 + "x";
        for (let s in SHAPE) {
            if (shape0.indexOf(s) != -1) {
                shape0.push(s);
                break;
            }
        }
        for (let s in SHAPE) {
            if (shape1.indexOf(s) != -1) {
                shape1.push(s);
                break;
            }
        }
    }

    return [shapes0, shapes1];
}

const forEach2d = (arr2d, func) => {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (!func(i, j, arr2d[i][j])) {
                return false;
            }
        }
    }
}

const calcCurrent = (board, color) => {
    let data = getShapes(board, color);
    let shapes0 = data[0];
    let shapes1 = data[1];
    return shapes0.reduce((s, k) => s += SHAPE[k][0], 0) - shapes1.reduce((s, k) => s += SHAPE[k][1], 0);
}


const calcDepth = (board, color, depth) => {
    let r = { xys: [], v: -Infinity };
    forEach2d(board, (y, x, s) => {
        if (s != 0) {
            return true;
        }
        board[y][x] = color;
        let v = calcCurrent(board, color);
        if (v == Infinity) {
            r = { xys: [{ x, y }], v };
            return false;
        }
        if (depth == 1) {
            if (v == r.v) {
                r.xys.push({ x, y });
            }
            if (v > r.v) {
                r = { xys: [{ x, y }], v };
            }
        } else {
            let o = calcDepth(board, 1 - color, depth);
            board[o.y][o.x] = 1 - color;
            let nr = calcDepth(board, color, depth - 1);
            if (nr.v == r.v) {
                r.xys.push({ x, y });
            }
            if (nr.v > r.v) {
                r = { xys: [{ x, y }], v: nr.v };
            }
            board[o.y][o.x] = 0;
        }
        board[y][x] = 0;
        return true;
    });
    return { ...r.xys[Math.floor(Math.random() * r.xys.length)], v: r.v };
}