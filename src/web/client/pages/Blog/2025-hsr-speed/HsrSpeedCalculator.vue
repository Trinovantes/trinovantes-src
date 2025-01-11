<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from 'vue'
import HsrAvTimeline from './HsrAvTimeline.vue'
import { computeCycleTurns, computeUnitTurns, getTotalAv, getAvFromSpeed } from './HsrAv'

const INIT_SPEED = 160
const MAX_CYCLES = 4

const uid = getCurrentInstance()?.uid
const hasVonwacq = ref<boolean | null>(false)
const charSpeed = ref<number>(INIT_SPEED)
const charAv = computed(() => getAvFromSpeed(charSpeed.value))

const maxAv = computed(() => getTotalAv(MAX_CYCLES))
const cycleTurns = computed(() => computeCycleTurns(MAX_CYCLES))
const charTurns = computed(() => computeUnitTurns(charSpeed.value, maxAv.value, hasVonwacq.value))
</script>

<template>
    <div class="calculator">
        <form>
            <label
                for="charSpeed"
            >
                Character Speed
                <input
                    v-model.number="charSpeed"
                    type="range"
                    min="90"
                    max="200"
                    step="1"
                    id="charSpeed"
                >
            </label>

            <label
                :for="`hasVonwacq-${uid}`"
                title="If character has at least 120 Spd, action advances character by 40% at the start of battle"
            >
                Has Vonwacq Equipped
                <div>
                    <input
                        v-model="hasVonwacq"
                        type="checkbox"
                        :id="`hasVonwacq-${uid}`"
                    >
                </div>
            </label>
        </form>

        <div class="timelines">
            <HsrAvTimeline
                label="Game Time"
                :turns="cycleTurns"
                :get-turn-label="(turnNum) => `End of Cycle ${turnNum}`"
            />
            <HsrAvTimeline
                :label="`Character (${charSpeed.toFixed(1)} Spd) (${charAv.toFixed(1)} AV)`"
                :turns="charTurns"
                :get-turn-label="(turnNum) => `Character's Turn ${turnNum}`"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.calculator{
    border: 1px solid;
    overflow-x: auto;

    form,
    .timelines{
        padding: $padding;
    }

    .form{
        border-top: 1px solid;
    }

    .timelines{
        display: grid;
        gap: $padding;
        grid-template-columns: 250px repeat(1, 1fr);
        min-width: 800px;
    }
}
</style>
