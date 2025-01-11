<script lang="ts" setup>
defineProps<{
    label: string
    height: number
    time: number
}>()
</script>

<template>
    <div
        class="timeline-item"
        :style="{
            height: `${height}px`
        }"
    >
        <strong title="Time">
            {{ time.toFixed(0) }}
        </strong>
        <span>
            {{ label }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
.timeline-item{
    border-bottom: 1px solid;
    position: relative;

    strong{
        font-size: 15px;
        line-height: 20px;
        text-align: center;

        background: white;
        border: 1px solid;
        position: absolute;
        width: 40px; height: 20px;
        bottom:-10px; left:0;
    }

    span{
        line-height: 30px;

        background: white;
        position: absolute;
        height: 30px;
        bottom:-15px; left:40px + $padding;
    }
}
</style>
