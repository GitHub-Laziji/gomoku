

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
import { calc, getShapes, create2DArr } from "./utils/calc"
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
            for (let shape of getShapes(this.points, x, y)) {
                if (shape.indexOf("ooooo") != -1) {
                    this.win = this.points[y][x];
                    this.start = false;
                    console.log(JSON.stringify(this.points), x, y);
                    return false;
                }
            }
            return true;
        },
        calc() {
            let m = JSON.stringify(this.points);
            let points = JSON.parse(m);
            let { x, y } = calc(points, this.current, 3);
            // console.log(x, y)
            this.putPoint(x, y);
        },

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
