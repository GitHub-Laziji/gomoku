

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
                <!-- <button style="width:100%;font-size: 16px;margin-top: 15px;" @click="onTest">测试</button> -->
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
    "ooooo": 0,
    "_oooo_": 1,
    "_oooo": 2,
    "oooo_": 2,
    "ooo_o": 2,
    "o_ooo": 2,
    "oo_oo": 2,
    "_ooo__": 3,
    "__ooo_": 3,
    "_oo_o_": 3,
    "_o_oo_": 3,
    "ooo__": 4,
    "__ooo": 4,
    "oo_o_": 4,
    "_oo_o": 4,
    "oo__o": 4,
    "o__oo": 4,
    "o_o_o": 4,
    "_ooo_": 4,
    "__oo__": 5,
    "_o_o_": 5,
    "_o__o_": 5,
    "oo___": 6,
    "___oo": 6,
    "o_o__": 6,
    "__o_o": 6,
    "o__o_": 6,
    "_o__o": 6,
    "o___o": 6,
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
const randomInt = (n) => {
    return Math.floor(Math.random() * n);
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
        }
    },
    mounted() {

    },
    methods: {
        // onTest() {
        //     this.points = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, 1, 0, -1, -1, 0, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, 1, 1, 0, 1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, 0, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1], [-1, -1, -1, 1, -1, -1, 0, 1, 0, 1, 1, -1, -1, -1, -1], [-1, -1, -1, -1, 0, -1, 1, 1, 0, -1, 0, -1, -1, -1, -1], [-1, -1, -1, -1, -1, 0, -1, 0, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, 1, -1, 0, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]]
        //     this.current = 1;
        //     this.start = true;
        //     setTimeout(() => {
        //         this.calc();
        //     }, 1000)

        // },
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
            this.putPoint(x, y) && this.calc();
        },
        putPoint(x, y) {
            this.points[y][x] = this.current;
            this.current = 1 - this.current;
            this.step++;
            if (this.step == 15 * 15) {
                this.win = 2;
                return false;
            }
            let dx = [0, 1, 1, 1, 0, -1, -1, -1];
            let dy = [1, 1, 0, - 1, -1, -1, 0, 1];
            let color = this.points[y][x];
            for (let i = 0; i < 8; i++) {
                let f = true;
                for (let c = 1; c < 5; c++) {
                    let nowX = x - c * dx[i];
                    let nowY = y - c * dy[i];
                    if (nowX < 0 || nowX >= 15 || nowY < 0 || nowY >= 15 || this.points[nowY][nowX] != color) {
                        f = false;
                        break;
                    }
                }
                if (f) {
                    this.win = color;
                    this.start = false;
                    console.log(JSON.stringify(this.points), x, y);
                    return false;
                }
            }
            return true;
        },
        calc() {
            let m = JSON.stringify(this.points);
            let { x, y } = this.prediction(JSON.parse(m), this.current);
            this.putPoint(x, y);
        },
        test(points, color, deepth) {
            if (deepth == 1) {
                return this.prediction(points, color);
            }
        },
        prediction(points, color) {
            let mySituation = create2DArr(15, 15, 0);
            let opponentSituation = create2DArr(15, 15, 0);
            let optionalMove = [];
            let prevX = -1;
            let prevY = -1;
            for (let y = 0; y < 15; y++) {
                for (let x = 0; x < 15; x++) {
                    mySituation[y][x] = this.assessPoint(x, y, color, points);
                    opponentSituation[y][x] = this.assessPoint(x, y, 1 - color, points);
                    let cmp = this.comparativeScore(prevX, prevY, x, y, mySituation, opponentSituation, 15)
                    switch (cmp) {
                        case 0:
                            optionalMove.push({ x, y, v: mySituation[y][x] });
                            continue;
                        case 1:
                            prevX = x;
                            prevY = y;
                            optionalMove = [];
                            optionalMove.push({ x, y, v: mySituation[y][x] });
                        default:
                    }
                }
            }
            return optionalMove[0];
        },
        assessPoint(x, y, color, points) {
            if (points[y][x] != -1) {
                return 0;
            }
            let lineGrade = [0, 0, 0, 0, 0, 0, 0, 1];
            let bastGrade = 7;

            let dx = [0, 1, 1, 1,];
            let dy = [1, 1, 0, - 1];
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
                for (let k in SHAPE) {
                    if (lineShape.indexOf(k) != -1) {
                        lineGrade[SHAPE[k]]++;
                        bastGrade = Math.min(bastGrade, SHAPE[k]);
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
        },
        comparativeScore(prevX, prevY, x, y, mys, ops) {
            if (mys[y][x] == 0)
                return -1;
            if (prevX == -1)
                return 1;
            let myPrevScore = mys[prevY][prevX];
            let myNowScore = mys[y][x];
            let opPrevScore = ops[prevY][prevX];
            let opNowScore = ops[y][x];
            if (myPrevScore >= opPrevScore
                && (myNowScore > myPrevScore
                    || opNowScore > myPrevScore
                    || myNowScore == myPrevScore
                    && opNowScore > opPrevScore)) {
                return 1;
            }

            if (opPrevScore > myPrevScore
                && (opNowScore > opPrevScore
                    || myNowScore >= opPrevScore
                    || opNowScore == opPrevScore
                    && myNowScore > myPrevScore)) {
                return 1;
            }

            let center = Math.floor(15 / 2);
            let prevCenter = Math.max(Math.abs(prevX - center), Math.abs(prevY - center));
            let nowCenter = Math.max(Math.abs(x - center), Math.abs(y - center));
            if (opPrevScore == opNowScore
                && myPrevScore == myNowScore
                && nowCenter < prevCenter) {
                return 1;
            }
            if (opPrevScore == opNowScore
                && myPrevScore == myNowScore
                && nowCenter == prevCenter) {
                return 0;
            }
            return -1;
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
