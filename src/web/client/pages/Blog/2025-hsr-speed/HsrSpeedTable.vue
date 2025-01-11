<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue'
import { ref } from 'vue'
import { getTargetSpeed } from './HsrAv'

const uid = getCurrentInstance()?.uid
const MAX_TURNS = 8
const MAX_CYCLES = 10

const hasVonwacq = ref<boolean | null>(false)
const rows = computed(() => {
    const rows = new Array<Array<string | number>>()

    for (let numCycles = 1; numCycles <= MAX_CYCLES; numCycles++) {
        const row = new Array<string | number>()
        row.push(numCycles - 1)

        for (let numTurns = 1; numTurns <= MAX_TURNS; numTurns++) {
            const speed = getTargetSpeed(numCycles, numTurns, hasVonwacq.value)
            row.push(speed.toFixed(1))
        }

        rows.push(row)
    }

    return rows
})
</script>

<template>
    <div class="calculator">
        <form>
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

        <table>
            <thead>
                <tr>
                    <td />
                    <td :colspan="MAX_TURNS">
                        Number of Turns
                    </td>
                </tr>
                <tr>
                    <td>
                        Cycle
                    </td>
                    <td
                        v-for="turn in MAX_TURNS"
                        :key="turn"
                    >
                        {{ turn }}
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="[rowIdx, row] of rows.entries()"
                    :key="rowIdx"
                >
                    <td
                        v-for="[colIdx, col] of row.entries()"
                        :key="colIdx"
                    >
                        {{ col }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
form{
    border: 1px solid;
    border-bottom: 0;
    padding: $padding;
}

table{
    width: 100%;

    td{
        text-align: right;

        &:first-child{
            border-right: 1px solid;
        }
    }

    thead{
        td[colspan]{
            text-align: center;
        }
    }
}
</style>
