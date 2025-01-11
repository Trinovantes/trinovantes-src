<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    data: Array<Array<string | number>>
}>()

const theadRow = computed(() => props.data.length === 0 ? [] : props.data[0])
const tbodyRows = computed(() => props.data.length <= 1 ? [] : props.data.toSpliced(1))
</script>

<template>
    <figure class="simple-table">
        <table>
            <thead>
                <tr
                    v-if="theadRow.length > 0"
                >
                    <td
                        v-for="[colIdx, col] of theadRow.entries()"
                        :key="colIdx"
                    >
                        {{ col }}
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="[rowIdx, row] of tbodyRows.entries()"
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
    </figure>
</template>

<style lang="scss" scoped>
figure.simple-table{
    overflow: auto;

    table{
        margin: 0 auto;
    }
}
</style>
