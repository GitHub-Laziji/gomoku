const PL5 = 1300;
const PL4 = 1200;
const PD44 = 1200;
const PD4L3 = 1200;
const PL33 = 1100
const PD3L3 = 1000
const PD4 = 900;
const PXD4 = 800;
const PL3 = 700;
const PX3 = 600;
const PL22 = 500;
const PL2 = 400;
const PX2 = 300;
const PD3 = 200;
const PD2 = 100;
const PDD = 1;

const SHAPE = {
    "ooooo": [90000, 9],

    //活4
    "_oooo_": [5000, 8],

    //眠4
    "oooo_": [2000, 7],
    "ooo_o": [2000, 7],
    "oo_oo": [2000, 7],
    "o_ooo": [2000, 7],
    "_oooo": [2000, 7],

    //活3
    "__ooo__": [2000, 7],

    //半活3  先手能成活4
    "_ooo__": [1500, 6],
    "_oo_o_": [1500, 6],
    "_o_oo_": [1500, 6],

    //眠3
    "ooo__": [720, 5],
    "oo_o_": [720, 5],
    "oo__o": [720, 5],
    "o_oo_": [720, 5],
    "o_o_o": [720, 5],
    "o__oo": [720, 5],
    "_ooo_": [720, 5],
    "_oo_o": [720, 5],
    "_o_oo": [720, 5],
    "__ooo": [720, 5],

    //活2
    "___oo___": [240, 5],

    //半活2
    "__oo___": [200, 4],
    "__o_o__": [200, 4],

    //眠2
    "oo___": [120, 3],
    "o_o__": [120, 3],
    "o__o_": [120, 3],
    "o___o": [120, 3],
    "_oo__": [120, 3],
    "_o_o_": [120, 3],
    "_o__o": [120, 3],
    "__oo_": [120, 3],
    "__o_o": [120, 3],
    "___oo": [120, 3],
    "____o____": [20, 2],
    "o____": [10, 1],
    "_o___": [10, 1],
    "__o__": [10, 1],
    "___o_": [10, 1],
    "____o": [10, 1],
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
export const getGrade = (points, x, y, color) => {
    let dx = [0, 1, 1, 1,];
    let dy = [1, 1, 0, - 1];
    let grade = 0;
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
        for (let s in SHAPE) {
            if (line.indexOf(s) != -1) {
                grade += SHAPE[s][0];
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
            grade = Math.max(grade, getGrade(points, x, y, color))
        }
    }
    return grade;
}

const assessOp = (points, color) => {
    let gM = assess(points, color);
    let gO = assess(points, 1 - color);
    if (gM >= gO) {
        return gM;
    }
    return -gO;
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
            let pg = getGrade(points, x, y, color);
            if (pg >= 90000) {
                points[y][x] = -1;
                changeRound(round, x, y, -1);
                return { x, y, g: pg };
            }
            let g = depth == 1 ? assessOp(points, color) : subCalc(points, 1 - color, depth - 1, round, maxG == null ? null : -maxG).g;
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