
const CHESS_MANUAL = {"7,7":{"6,6":{"8,6":{"7,5":{"6,8":{}},"5,7":{"7,5":{}},"8,5":{"6,8":{}},"7,6":{"6,8":{}},"6,7":{"6,8":{}},"9,5":{"7,8":{}},"6,8":{"8,5":{}},"9,6":{"7,8":{}},"8,7":{"6,8":{}},"7,8":{"6,8":{}},"9,7":{"6,8":{}},"8,8":{"9,7":{}},"5,5":{"8,7":{}},"6,5":{"6,8":{}},"5,6":{"9,7":{}}}},"7,6":{"6,6":{"7,5":{"5,5":{}},"5,7":{"5,5":{}},"8,5":{"6,7":{}},"6,7":{"8,5":{}},"8,6":{"8,8":{}},"6,8":{"8,8":{}},"8,7":{"8,8":{}},"7,8":{"8,8":{}},"8,8":{"6,5":{}},"5,5":{"8,8":{}},"6,5":{"5,5":{}},"5,6":{"5,5":{}}}},"6,7":{"6,6":{"7,5":{"5,5":{}},"5,7":{"5,5":{}},"7,6":{"8,5":{}},"5,8":{"7,6":{}},"8,6":{"8,8":{}},"6,8":{"8,8":{}},"8,7":{"8,8":{}},"7,8":{"8,8":{}},"8,8":{"5,6":{}},"5,5":{"8,8":{}},"6,5":{"5,5":{}},"5,6":{"5,5":{}}}},"8,6":{"6,6":{"7,5":{"8,8":{}},"5,7":{"8,8":{}},"8,5":{"8,8":{}},"7,6":{"8,8":{}},"6,7":{"8,8":{}},"9,5":{"6,7":{}},"6,8":{"5,7":{}},"9,6":{"5,7":{}},"8,7":{"8,8":{}},"7,8":{"8,8":{}},"9,7":{"7,5":{}},"8,8":{"6,5":{}},"5,5":{"7,8":{}},"6,5":{"8,8":{}},"5,6":{"7,8":{}}}},"6,8":{"6,6":{"7,5":{"8,8":{}},"5,7":{"8,8":{}},"7,6":{"8,8":{}},"6,7":{"8,8":{}},"5,8":{"8,8":{}},"8,6":{"5,7":{}},"5,9":{"7,6":{}},"8,7":{"8,8":{}},"7,8":{"8,8":{}},"6,9":{"7,5":{}},"8,8":{"5,6":{}},"7,9":{"5,7":{}},"5,5":{"8,7":{}},"6,5":{"8,7":{}},"5,6":{"8,8":{}}}},"8,7":{"8,6":{"7,5":{"9,5":{}},"6,6":{"6,8":{}},"8,5":{"9,5":{}},"7,6":{"6,5":{}},"6,7":{"6,8":{}},"9,5":{"6,8":{}},"6,8":{"9,6":{}},"9,6":{"9,5":{}},"7,8":{"6,8":{}},"9,7":{"9,5":{}},"8,8":{"6,8":{}},"9,8":{"7,6":{}}}},"7,8":{"6,8":{"6,6":{"8,6":{}},"5,7":{"5,9":{}},"7,6":{"8,6":{}},"6,7":{"5,6":{}},"5,8":{"5,9":{}},"8,6":{"6,9":{}},"5,9":{"8,6":{}},"8,7":{"8,6":{}},"6,9":{"5,9":{}},"8,8":{"8,6":{}},"7,9":{"5,9":{}},"8,9":{"6,7":{}}}},"8,8":{"8,6":{"7,5":{"6,8":{}},"6,6":{"9,7":{}},"8,5":{"6,7":{}},"7,6":{"6,8":{}},"6,7":{"6,8":{}},"9,5":{"6,7":{}},"6,8":{"9,6":{}},"9,6":{"6,8":{}},"8,7":{"6,8":{}},"7,8":{"6,8":{}},"9,7":{"6,8":{}},"7,9":{"9,7":{}},"9,8":{"6,8":{}},"8,9":{"7,5":{}},"9,9":{"7,6":{}}}}}}



const b2 = (n) => {
    return 1 << (n + 1);
}
const sum = (arr) => {
    let s = 0;
    arr.forEach(o => s += o);
    return s;
}
const INF = b2(19);
const SHAPE = {
    "ooooo": [INF, 11],

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

const create2DArr = (w, h, v) => {
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
let DXY = [[1, 0], [1, 1], [0, 1], [-1, 1]];
const getShapes = (points, x, y, d) => {
    if (points[y][x] == -1) {
        return [];
    }
    let color = points[y][x];
    let shapes = [];
    for (let t = 0; t < 4; t++) {
        if (d !== undefined && t != d) {
            continue;
        }
        let line = "o";
        for (let i = 1; i <= 4; i++) {
            let xx = x + i * DXY[t][0];
            let yy = y + i * DXY[t][1];
            if (xx < 0 || xx >= points[0].length || yy < 0 || yy >= points.length || points[yy][xx] == 1 - color) {
                break;
            } else if (points[yy][xx] == color) {
                line += "o"
            } else {
                line += "_"
            }
        }
        for (let i = -1; i >= -4; i--) {
            let xx = x + i * DXY[t][0];
            let yy = y + i * DXY[t][1];
            if (xx < 0 || xx >= points[0].length || yy < 0 || yy >= points.length || points[yy][xx] == 1 - color) {
                break;
            } else if (points[yy][xx] == color) {
                line = "o" + line;
            } else {
                line = "_" + line;
            }
        }
        shapes[t] = line;
    }
    return shapes;
}
const getGrade = (points, x, y, d) => {
    let grade = [0, 0, 0, 0, 0];
    if (points[y][x] == -1) {
        return grade;
    }
    let shapes = getShapes(points, x, y, d);
    for (let i = 0; i < 4; i++) {
        if (!shapes[i]) {
            continue;
        }
        for (let s in SHAPE) {
            if (shapes[i].indexOf(s) != -1) {
                grade[i] = SHAPE[s][0];
                grade[4] += grade[i];
                break;
            }
        }
    }
    return grade;
}

const print = (name, arr2d, getValue) => {
    console.log(getValue)
    let result = "------------------------\n";
    result += `-----------${name}-------------\n`;
    for (let y = 0; y < arr2d.length; y++) {
        for (let x = 0; x < arr2d[0].length; x++) {
            result += (getValue ? getValue(arr2d[y][x]) : arr2d[y][x]) + "\t"
        }
        result += "\n"
    }
    console.log(result)
}

const foreach = (arr2d, handler) => {
    let bkFlag = false;
    const bk = () => bkFlag = true;
    for (let y = 0; y < arr2d.length; y++) {
        for (let x = 0; x < arr2d[0].length; x++) {
            handler(x, y, arr2d[y][x], bk);
            if (bkFlag) {
                return;
            }
        }
    }
}

const BLACK = 1;
const WHITE = 0;
const EMPTY = -1;
class Chess {

    constructor(points, current) {
        if (!points || !points.length || points.length != points[0].length) {
            throw new Error();
        }
        this.points = JSON.parse(JSON.stringify(points));
        this.w = this.points.length;
        this.current = current;
        this.passArea = create2DArr(this.w, this.w, 0);
        this.passArea[Math.floor(this.w / 2)][Math.floor(this.w / 2)] = 1;
        foreach(this.points, (x, y, v) => v != EMPTY && changeRound(this.passArea, x, y, 1));

        this.fullGrade = [0, 0];
        this.gradeArea = create2DArr(this.w, this.w, [0, 0, 0, 0, 0]);
        foreach(this.points, (x, y, v) => {
            if (v == EMPTY) {
                return;
            }
            this.gradeArea[y][x] = getGrade(this.points, x, y);
            this.gradeArea[y][x][4] = sum(this.gradeArea[y][x]);
            this.fullGrade[BLACK] += (v == BLACK ? 1 : -1) * this.gradeArea[y][x][4];
            this.fullGrade[WHITE] += (v == WHITE ? 1 : -1) * this.gradeArea[y][x][4];
        });

        this.cm = CHESS_MANUAL;
    }

    getPoints() {
        return JSON.parse(JSON.stringify(this.points));
    }

    isWin(x, y) {
        if (this.points[y][x] == EMPTY) {
            return false;
        }
        for (let shape of getShapes(this.points, x, y)) {
            if (shape.indexOf("ooooo") != -1) {
                return true;
            }
        }
        return false;
    }

    updateMiGrade(x, y) {
        for (let t = 0; t < 4; t++) {
            for (let i = -4; i <= 4; i++) {
                if (i == 0) {
                    continue;
                }
                let xx = x + i * DXY[t][0];
                let yy = y + i * DXY[t][1];
                if (xx >= 0 && xx < this.w && yy >= 0 && yy < this.w) {
                    let grade = getGrade(this.points, xx, yy, t);
                    let dGrade = grade[t] - this.gradeArea[yy][xx][t];
                    let v = this.points[yy][xx];
                    this.fullGrade[BLACK] += (v == BLACK ? 1 : -1) * dGrade;
                    this.fullGrade[WHITE] += (v == WHITE ? 1 : -1) * dGrade;
                    this.gradeArea[yy][xx][4] += dGrade;
                    this.gradeArea[yy][xx][t] = grade[t];
                }
            }
        }
    }

    putPoint(x, y, color, fixed) {
        if (this.points[y][x] != EMPTY) {
            return false;
        }
        this.points[y][x] = color;
        changeRound(this.passArea, x, y, 1);
        this.updateMiGrade(x, y);
        this.gradeArea[y][x] = getGrade(this.points, x, y);
        this.gradeArea[y][x][4] = sum(this.gradeArea[y][x]);
        this.fullGrade[BLACK] += (color == BLACK ? 1 : -1) * this.gradeArea[y][x][4];
        this.fullGrade[WHITE] += (color == WHITE ? 1 : -1) * this.gradeArea[y][x][4];

        if (this.cm) {
            this.cm = this.cm[`${x},${y}`];
        }
        return true;
    }


    removePoint(x, y) {
        let color = this.points[y][x];
        this.points[y][x] = EMPTY;
        changeRound(this.passArea, x, y, -1);
        this.updateMiGrade(x, y);
        this.fullGrade[BLACK] += (color == BLACK ? -1 : 1) * this.gradeArea[y][x][4];
        this.fullGrade[WHITE] += (color == WHITE ? -1 : 1) * this.gradeArea[y][x][4];
        this.gradeArea[y][x] = [0, 0, 0, 0, 0];
    }

    // assess(color) {
    //     let grade = 0;
    //     for (let y = 0; y < this.w; y++) {
    //         for (let x = 0; x < this.w; x++) {
    //             let v = this.points[y][x];
    //             if (v != EMPTY) {
    //                 grade += (v == color ? 1 : -1) * this.gradeArea[y][x][4];
    //             }
    //         }
    //     }
    //     // foreach(this.points, (x, y, v) => v != EMPTY && (grade += (v == color ? 1 : -1) * this.gradeArea[y][x][4]));
    //     return grade;
    // }

    calc(color, depth) {
        if (color == BLACK && this.cm) {
            for (let k in this.cm) {
                let xy = k.split(",");
                return { x: Number(xy[0]), y: Number(xy[1]) };
            }
        }
        return this.subCalc(color, depth, null);
    }

    subCalc(color, depth, preMin) {
        let maxG = null;
        let p;
        for (let y = 0; y < this.w; y++) {
            for (let x = 0; x < this.w; x++) {
                if (this.points[y][x] != EMPTY || this.passArea[y][x] == 0) {
                    continue;
                }
                this.putPoint(x, y, color);
                let pg = getGrade(this.points, x, y);
                if (pg[4] >= INF) {
                    this.removePoint(x, y);
                    return { x, y, g: INF };
                }
                let g = depth == 1 ? this.fullGrade[1 - color] : this.subCalc(1 - color, depth - 1, maxG == null ? null : -maxG).g;
                this.removePoint(x, y);
                g = -g;
                if (maxG == null || g > maxG) {
                    maxG = g;
                    p = { x, y };
                }
                if (preMin !== null && preMin !== undefined && maxG >= preMin) {
                    return { x, y, g: INF };
                }
            }
        }
        return { ...p, g: maxG };
    }
}
