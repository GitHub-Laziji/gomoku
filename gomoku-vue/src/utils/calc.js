const b2 = (n) => {
    return 1 << (n + 1);
}
const SHAPE = {
    "ooooo": [b2(19), 11],

    //活4
    "_oooo_": [b2(14), 10],

    //眠4
    "oooo_": [b2(9), 9],
    "ooo_o": [b2(9), 9],
    "oo_oo": [b2(9), 9],
    "o_ooo": [b2(9), 9],
    "_oooo": [b2(9), 9],

    //活3
    "__ooo__": [b2(9), 8],

    //半活3  先手能成活4
    "_ooo__": [b2(8), 7],
    "_oo_o_": [b2(8), 7],
    "_o_oo_": [b2(8), 7],

    //眠3
    "ooo__": [b2(7), 6],
    "oo_o_": [b2(7), 6],
    "oo__o": [b2(7), 6],
    "o_oo_": [b2(7), 6],
    "o_o_o": [b2(7), 6],
    "o__oo": [b2(7), 6],
    "_ooo_": [b2(7), 6],
    "_oo_o": [b2(7), 6],
    "_o_oo": [b2(7), 6],
    "__ooo": [b2(7), 6],

    //活2
    "___oo___": [b2(7), 5],

    //半活2
    "__oo___": [b2(6), 4],
    "__o_o__": [b2(6), 4],

    //眠2
    "_oo__": [b2(5), 3],
    "__oo_": [b2(5), 3],
    "_o_o_": [b2(5) - 1, 3],
    "oo___": [b2(5) - 2, 3],
    "o_o__": [b2(5) - 2, 3],
    "o__o_": [b2(5) - 2, 3],
    "o___o": [b2(5) - 2, 3],
    "_o__o": [b2(5) - 2, 3],
    "__o_o": [b2(5) - 2, 3],
    "___oo": [b2(5) - 2, 3],

    //活1
    "____o____": [b2(5), 2],

    //眠1
    "__o__": [b2(3), 1],
    "_o___": [b2(3) - 1, 1],
    "___o_": [b2(3) - 1, 1],
    "o____": [b2(3) - 2, 1],
    "____o": [b2(3) - 2, 1],
}

export const create2DArr = (w, h, v) => {
    let arr = [];
    for (let y = 0; y < h; y++) {
        arr[y] = []
        for (let x = 0; x < w; x++) {
            arr[y][x] = v;
        }
    }
    return arr;
}
const changeRound = (round, x, y, t) => {
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            let nowX = x + dx;
            let nowY = y + dy;
            if (nowX < 0 || nowX >= round[0].length || nowY < 0 || nowY >= round.length) {
                continue;
            }
            round[nowY][nowX] += t;
        }
    }
}
const getRoundArr = (points) => {
    let round = create2DArr(points.length, points[0].length, 0);
    round[Math.floor(points.length / 2)][Math.floor(points[0].length / 2)] = 1;
    for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points[0].length; x++) {
            if (points[y][x] != -1) {
                changeRound(round, x, y, 1);
            }
        }
    }
    return round;
}
export const getShapes = (points, x, y) => {
    if (points[y][x] == -1) {
        return [];
    }
    let color = points[y][x];
    let dx = [0, 1, 1, 1,];
    let dy = [1, 1, 0, - 1];
    let shapes = [];
    for (let t = 0; t < 4; t++) {
        let line = "";
        for (let i = -4; i <= 4; i++) {
            let xx = x + i * dx[t];
            let yy = y + i * dy[t];
            if (xx < 0 || xx >= points[0].length || yy < 0 || yy >= points.length || points[yy][xx] == 1 - color) {
                line += "x"
            } else if (points[yy][xx] == color) {
                line += "o"
            } else {
                line += "_"
            }
        }
        shapes.push(line);
    }
    return shapes;
}
const getGrade = (points, x, y) => {
    let grade = 0;
    let shapes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let shape of getShapes(points, x, y)) {
        for (let s in SHAPE) {
            if (shape.indexOf(s) != -1) {
                grade += SHAPE[s][0];
                shapes[SHAPE[s][1]]++
                break;
            }
        }
    }
    return grade;
}

const assess = (points, color) => {
    let grade = 0;
    for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points[0].length; x++) {
            if (points[y][x] == -1) {
                continue;
            }
            grade += (points[y][x] == color ? 1 : -1) * getGrade(points, x, y);
        }
    }
    return grade;
}

const subCalc = (points, color, depth, round, preMin) => {
    let maxG = null;
    let p;
    for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points[0].length; x++) {
            if (points[y][x] != -1 || round[y][x] == 0) {
                continue;
            }
            points[y][x] = color;
            changeRound(round, x, y, 1);
            let pg = getGrade(points, x, y);
            if (pg >= SHAPE['ooooo']) {
                points[y][x] = -1;
                changeRound(round, x, y, -1);
                return { x, y, g: pg };
            }
            let g = depth == 1 ? assess(points, 1 - color) : subCalc(points, 1 - color, depth - 1, round, maxG == null ? null : -maxG).g;
            points[y][x] = -1;
            changeRound(round, x, y, -1);
            g = -g;
            if (maxG == null || g > maxG) {
                maxG = g;
                p = { x, y };
            }
            if (preMin !== null && preMin !== undefined && maxG >= preMin) {
                return { x, y, g: maxG };
            }
        }
    }
    if (maxG == null) {
        maxG = -assessOp(points, 1 - color);
    }
    return { ...p, g: maxG };
}

export const calc = (points, color, depth) => {
    let { x, y } = subCalc(points, color, depth, getRoundArr(points), null);
    return { x, y };
}