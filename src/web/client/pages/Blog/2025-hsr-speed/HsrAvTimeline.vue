<script lang="ts" setup>
import HsrAvTimelineItem from './HsrAvTimelineItem.vue'
import type { HsrTurn } from './HsrAv.ts'

defineProps<{
    label: string
    turns: Array<HsrTurn>
    getTurnLabel: (turnNum: number) => string
}>()
</script>

<template>
    <div class="timeline">
        <strong>
            {{ label }}
        </strong>

        <HsrAvTimelineItem
            v-for="{ turnNum, actionValue, time } in turns"
            :key="turnNum"
            :label="getTurnLabel(turnNum)"
            :height="actionValue * 2"
            :time="time"
        />
    </div>
</template>

<style lang="scss" scoped>
.timeline{
    background: white;
    padding-bottom: 15px;

    strong{
        border-bottom: 1px solid;
        display: block;
    }
}
</style>
