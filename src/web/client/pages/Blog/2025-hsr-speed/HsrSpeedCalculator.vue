<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from 'vue'
import HsrAvTimeline from './HsrAvTimeline.vue'
import { computeCycleTurns, computeUnitTurns, getTotalAv, getAvFromSpeed, type HsrTurn } from './HsrAv.ts'

const INIT_SPEED = 160
const MAX_CYCLES = 4

const uid = getCurrentInstance()?.uid

const charSpeed = ref<number>(INIT_SPEED)
const charAv = computed(() => getAvFromSpeed(charSpeed.value))
const hasVonwacq = ref<boolean | null>(false)
const hasEagle = ref<boolean | null>(false)
const turnsForUlt = ref<number>(3)
const hasDdd = ref<boolean | null>(false)

const maxAv = computed(() => getTotalAv(MAX_CYCLES))
const cycleTurns = computed(() => computeCycleTurns(MAX_CYCLES))
const charTurns = computed(() => computeUnitTurns(maxAv.value, {
    speed: charSpeed.value,
    hasVonwacq: hasVonwacq.value ?? false,
    hasEagle: hasEagle.value ?? false,
    turnsForUlt: turnsForUlt.value,
    hasDdd: hasDdd.value ?? false,
}))

const getTimelineTurnLabel = (turn: HsrTurn) => {
    return `End of Cycle ${turn.turnNum}`
}

const getCharTurnLabel = (turn: HsrTurn) => {
    let label = `Character's Turn ${turn.turnNum}`

    if (turn.hasCastUlt) {
        label += ' (Ult)'
    }

    return label
}
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
                :for="`turnsToUlt-${uid}`"
            >
                Turns for Ult
                <div>
                    <select v-model="turnsForUlt">
                        <option
                            v-for="n in 4"
                            :key="n"
                            :value="n"
                        >
                            {{ n }}
                        </option>
                    </select>
                </div>
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

            <label
                :for="`hasEagle-${uid}`"
                title="Action advances character by 25% after using their ultimate"
            >
                Has Eagle 4P
                <div>
                    <input
                        v-model="hasEagle"
                        type="checkbox"
                        :id="`hasEagle-${uid}`"
                    >
                </div>
            </label>

            <label
                :for="`hasDdd-${uid}`"
                title="Action advances all characters by 24% after using their ultimate"
            >
                Has DDD Light Cone
                <div>
                    <input
                        v-model="hasDdd"
                        type="checkbox"
                        :id="`hasDdd-${uid}`"
                    >
                </div>
            </label>
        </form>

        <div class="timelines">
            <HsrAvTimeline
                label="Game Time"
                :turns="cycleTurns"
                :get-turn-label="getTimelineTurnLabel"
            />
            <HsrAvTimeline
                :label="`Character (${charSpeed.toFixed(1)} Spd) (${charAv.toFixed(1)} AV)`"
                :turns="charTurns"
                :get-turn-label="getCharTurnLabel"
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
