<script lang="ts" setup>
import HsrAvTimelineItem from './HsrAvTimelineItem.vue'
import type { HsrTurn } from './HsrAv.ts'

defineProps<{
    label: string
    turns: Array<HsrTurn>
    getTurnLabel: (turn: HsrTurn) => string
}>()
</script>

<template>
    <div class="timeline">
        <strong>
            {{ label }}
        </strong>

        <HsrAvTimelineItem
            v-for="turn in turns"
            :key="turn.turnNum"
            :label="getTurnLabel(turn)"
            :height="turn.actionValue * 2"
            :time="turn.time"
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
