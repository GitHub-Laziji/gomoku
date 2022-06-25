

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
                    <div v-else>点击右方按钮开始</div>
                </div>
            </div>
            <div style="width:140px;padding: 30px;">
                <button style="width:100%;font-size: 16px;" @click="onStart(1)">先手开始</button>
                <button style="width:100%;font-size: 16px;margin-top: 15px;" @click="onStart(0)">后手开始</button>
            </div>
        </div>
    </div>
</template>

<script >
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
        }
    },
    mounted() {

    },
    methods: {
        onStart(t) {
            this.current = t;
            this.start = true;
            for (let y = 0; y < 15; y++) {
                this.points[y] = []
                for (let x = 0; x < 15; x++) {
                    this.points[y][x] = -1;
                }
            }
            if (t === 1) {
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
            this.points[y][x] = this.current;
            if (this.endValid(x, y)) {
                return;
            }
            this.current = 1 - this.current;
            this.calc();
        },
        calc() {

        },
        endValid(x, y) {

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
