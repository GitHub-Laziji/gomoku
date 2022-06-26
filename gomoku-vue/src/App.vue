

<template>
    <div>
        <div style="display:flex">
            <div class="checkerboard">
                <div v-for="(_, index) of new Array(15)" class="h-line"
                    :style="{ top: (index * unitW + unitW) + 'px' }">
                </div>
                <div v-for="(_, index) of new Array(15)" class="v-line"
                    :style="{ left: (index * unitW + unitW) + 'px' }">
                </div>
                <div class="mk" :style="{ top: (8 * unitW - 2) + 'px', left: (8 * unitW - 2) + 'px' }"></div>
                <div class="mk" :style="{ top: (4 * unitW - 2) + 'px', left: (4 * unitW - 2) + 'px' }"></div>
                <div class="mk" :style="{ top: (4 * unitW - 2) + 'px', left: (12 * unitW - 2) + 'px' }"></div>
                <div class="mk" :style="{ top: (12 * unitW - 2) + 'px', left: (4 * unitW - 2) + 'px' }"></div>
                <div class="mk" :style="{ top: (12 * unitW - 2) + 'px', left: (12 * unitW - 2) + 'px' }"></div>

                <template v-for="(row, y) of this.points">
                    <template v-for="(col, x) of row">
                        <div v-if="col != -1" :class="'point point-' + col"
                            :style="{ top: (y * unitW + unitW - pointW / 2) + 'px', left: (x * unitW + unitW - pointW / 2) + 'px' }">
                        </div>
                    </template>
                </template>

                <div class="checkerboard-ck" @click="onCbClick" v-if="start"></div>
                <div class="checkerboard-win" v-if="!start">
                    <div v-if="win === 1">黑方胜</div>
                    <div v-else-if="win === 0">白方胜</div>
                    <div v-else-if="win === 2">平局</div>
                    <div v-else>点击右方按钮开始</div>
                </div>
            </div>
            <div style="width:140px;padding: 30px;">
                <button style="width:100%;font-size: 16px;" @click="onStart(1)">棋手先开始</button>
                <button style="width:100%;font-size: 16px;margin-top: 15px;" @click="onStart(0)">电脑先开始</button>
                <button style="width:100%;font-size: 16px;margin-top: 15px;" @click="onTest">测试</button>
                <button style="width:100%;font-size: 16px;margin-top: 15px;" @click="print">打印</button>
            </div>
        </div>
    </div>
</template>

<script >
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
    "ooooo": 90000,
    "_oooo_": 4320,
    "_ooo__": 720,
    "__ooo_": 720,
    "_oo_o_": 720,
    "_o_oo_": 720,
    "oooo_": 720,
    "_oooo": 720,
    "oo_oo": 720,
    "o_ooo": 720,
    "ooo_o": 720,
    "__oo__": 120,
    "__o_o_": 120,
    "_o_o__": 120,
    "___o__": 20,
    "__o___": 20
}
const print = (b) => {
    let r = "";
    for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < b[i].length; j++) {
            let s = "" + b[i][j];
            s += " ".repeat(5 - s.length);
            r += s;
        }
        r += "\n";
    }
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
const changePutRound = (round, x, y, t) => {
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
const getPutRound = (points) => {
    let round = create2DArr(points.length, points[0].length, 0);
    round[7][7] = 1;
    for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points[0].length; x++) {
            if (points[y][x] != -1) {
                changePutRound(round, x, y, 1);
            }
        }
    }
    return round;
}
const randomInt = (n) => {
    return Math.floor(Math.random() * n);
}
const getMaxGrade = (grades) => {
    let grade = Math.max(...grades);
    let type;
    for (type = 0; type < grades.length; type++) {
        if (grades[type] == grade) {
            break;
        }
    }
    return { grade, type };
}
const cmp = (a, b) => {
    if (b.maxGrade.grade != a.maxGrade.grade) {
        return b.maxGrade.grade - a.maxGrade.grade
    }
    return a.maxGrade.type - b.maxGrade.type;
}

const getShapes = (x, y, color, points) => {
    let dx = [0, 1, 1, 1,];
    let dy = [1, 1, 0, - 1];
    let shapes = [];
    for (let i = 0; i < 4; i++) {
        let line = [];
        let nowX = x - 4 * dx[i];
        let nowY = y - 4 * dy[i];
        while (line.length < 9) {
            if (line.length == 4) {
                line.push(color);
            } else if (nowX < 0 || nowX >= 15 || nowY < 0 || nowY >= 15) {
                line.push(1 - color);
            } else {
                line.push(points[nowY][nowX]);
            }
            nowX += dx[i];
            nowY += dy[i];
        }
        let lineShape = line.map(o => ({ [-1]: "_", [color]: "o", [1 - color]: "x" })[o]).join("");
        shapes.push(lineShape);
    }
    return shapes;
}
export default {
    components: {
    },
    data() {
        return {
            unitW: 30,
            mkW: 5,
            pointW: 20,
            points: [],
            current: 1,
            start: false,
            win: -1,
            step: 0,
            prePoint: { x: null, y: null }
        }
    },
    mounted() {

    },
    methods: {
        onTest() {
            this.points = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 1, 0, 0, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, 1, -1, -1, 0, 1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, 1, 0, 0, 0, 0, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, 0, 0, 1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]]
            this.current = 1;
            this.start = true;
            setTimeout(() => {
                this.calc();
            }, 1000)

        },
        print() {
            let p = JSON.parse(JSON.stringify(this.points));
            p[this.prePoint.y][this.prePoint.x] = -1;
            console.log(JSON.stringify(p));
        },
        onStart(t) {
            this.current = 1;
            this.start = true;
            this.points = create2DArr(15, 15, -1);
            if (t === 0) {
                this.calc();
            }
        },
        onCbClick(e) {
            if (!this.start) {
                return;
            }
            let x = Math.floor((e.layerX - this.unitW / 2) / this.unitW);
            let y = Math.floor((e.layerY - this.unitW / 2) / this.unitW);
            if (this.points[y][x] != -1) {
                return;
            }
            if (this.putPoint(x, y)) {
                setTimeout(() => {
                    this.calc();
                }, 0)
            }
        },
        putPoint(x, y) {
            this.points[y][x] = this.current;
            this.prePoint = { x, y };
            this.current = 1 - this.current;
            this.step++;
            if (this.step == 15 * 15) {
                this.win = 2;
                return false;
            }
            for (let lineShape of getShapes(x, y, this.points[y][x], this.points)) {
                for (let k in SHAPE) {
                    if (lineShape.indexOf("ooooo") != -1) {
                        this.win = this.points[y][x];
                        this.start = false;
                        console.log(JSON.stringify(this.points), x, y);
                        return false;
                    }
                }
            }
            return true;
        },
        calc() {
            let m = JSON.stringify(this.points);
            let points = JSON.parse(m);
            let { x, y } = this.test(points, this.current, 4, getPutRound(points));
            // console.log(x, y)
            this.putPoint(x, y);
        },
        test(points, color, deepth, round) {
            let bsPs = [];
            for (let y = 0; y < 15; y++) {
                for (let x = 0; x < 15; x++) {
                    if (points[y][x] != -1 || round[y][x] == 0) {
                        continue;
                    }
                    let grades = [];
                    //????
                    grades[0] = this.assessPoint(x, y, color, points);
                    grades[1] = 0;
                    grades[2] = this.assessPoint(x, y, 1 - color, points);
                    bsPs.push({ x, y, grades, maxGrade: getMaxGrade(grades) })
                }
            }
            bsPs.sort(cmp)
            let newBsPs = []
            for (let i = 0; i < 10 && i < bsPs.length; i++) {
                let { x, y, grades } = bsPs[i];
                points[y][x] = color;
                changePutRound(round, x, y, 1)
                grades[1] = deepth == 1 ? 0 : this.test(points, 1 - color, deepth - 1, round).grade;
                changePutRound(round, x, y, - 1)
                points[y][x] = -1;
                newBsPs.push({ x, y, grades, maxGrade: getMaxGrade(grades) });
            }
            newBsPs.sort(cmp)
            if (deepth == 4) {
                console.log(newBsPs)
            }

            let o = { x: newBsPs[0].x, y: newBsPs[0].y, grade: newBsPs[0].maxGrade.grade, type: newBsPs[0].maxGrade.type }
            if (o.type == 2) {
                o.grade = -o.grade;
            }
            return o;
        },
        assessPoint(x, y, color, points) {
            if (points[y][x] != -1) {
                return 0;
            }
            let grade = 0;
            getShapes(x, y, color, points).forEach(lineShape => {
                for (let k in SHAPE) {
                    if (lineShape.indexOf(k) != -1) {
                        grade += SHAPE[k];
                        break;
                    }
                }
            })
            if (grade >= 90000) {
                grade = 90000;
            }
            return grade;
        }
    }
}
</script>

<style  lang="less" scoped>
.checkerboard {
    --unit-w: 30px;
    --mk-w: 5px;
    --line-w: 1px;
    --point-w: 20px;
    background: #E6A23C;
    width: calc(var(--unit-w) * 16);
    height: calc(var(--unit-w) * 16);
    position: relative;

    .checkerboard-ck {
        position: absolute;
        cursor: pointer;
        width: calc(var(--unit-w) * 16);
        height: calc(var(--unit-w) * 16);
        left: 0;
        top: 0;
    }

    .checkerboard-win {
        position: absolute;
        width: calc(var(--unit-w) * 16);
        height: calc(var(--unit-w) * 16);
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 600;
        color: #fff;
    }

    .h-line {
        position: absolute;
        height: var(--line-w);
        background: #000;
        width: calc(var(--unit-w) * 14);
        left: var(--unit-w);
    }

    .v-line {
        position: absolute;
        width: var(--line-w);
        background: #000;
        height: calc(var(--unit-w) * 14);
        top: var(--unit-w);
    }

    .mk {
        position: absolute;
        height: var(--mk-w);
        width: var(--mk-w);
        background: #000;
        border-radius: 50%;
    }

    .point {
        position: absolute;
        height: var(--point-w);
        width: var(--point-w);
        border-radius: 50%;

        &-1 {
            background: #000;
        }

        &-0 {
            background: #fff;
        }
    }
}
</style>
