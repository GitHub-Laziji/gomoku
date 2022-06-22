

<template>
    <div>
        <div class="checkerboard">
            <div v-for="(_, index) of new Array(15)" class="h-line" :style="{ top: (index * unitW + unitW) + 'px' }">
            </div>
            <div v-for="(_, index) of new Array(15)" class="v-line" :style="{ left: (index * unitW + unitW) + 'px' }">
            </div>
            <div class="point" :style="{ top: (8 * unitW - 2) + 'px', left: (8 * unitW - 2) + 'px' }"></div>
            <div class="point" :style="{ top: (4 * unitW - 2) + 'px', left: (4 * unitW - 2) + 'px' }"></div>
            <div class="point" :style="{ top: (4 * unitW - 2) + 'px', left: (12 * unitW - 2) + 'px' }"></div>
            <div class="point" :style="{ top: (12 * unitW - 2) + 'px', left: (4 * unitW - 2) + 'px' }"></div>
            <div class="point" :style="{ top: (12 * unitW - 2) + 'px', left: (12 * unitW - 2) + 'px' }"></div>
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
            pointW: 5
        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style  lang="less" scoped>
.checkerboard {
    --unit-w: 30px;
    --point-w: 5px;
    --line-w: 1px;
    background: #E6A23C;
    width: calc(var(--unit-w) * 16);
    height: calc(var(--unit-w) * 16);
    position: relative;

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

    .point {
        position: absolute;
        height: var(--point-w);
        width: var(--point-w);
        background: #000;
        border-radius: 50%;
    }
}
</style>
