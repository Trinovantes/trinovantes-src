<script lang="ts" setup>
import { computed } from 'vue'
import { hsrEnemies, getHsrElementIcon, hsrElements, HsrEnemy } from './HsrData'

const props = defineProps<{
    teamElements: Array<boolean>
}>()

defineEmits<{
    toggleElement: [idx: number]
}>()

const enemyCovered = computed<Array<boolean>>(() => {
    const covered = new Array<boolean>(hsrElements.length)

    for (let i = 0; i < hsrEnemies.length; i++) {
        covered[i] = hasWeaknessCovered(hsrEnemies[i])
    }

    return covered
})

const hasWeaknessCovered = (enemy: HsrEnemy): boolean => {
    for (let i = 0; i < hsrElements.length; i++) {
        if (enemy.weaknesses[i] && props.teamElements[i]) {
            return true
        }
    }

    return false
}
</script>

<template>
    <table class="popout">
        <thead>
            <tr>
                <td rowspan="2">
                    Elite Enemy ({{ enemyCovered.filter((covered) => covered).length }} / {{ hsrEnemies.length }})
                </td>
                <td colspan="7" class="center">
                    Select Weakness
                </td>
            </tr>
            <tr>
                <td
                    v-for="(element, idx) in hsrElements"
                    :key="element"
                    class="clickable"
                    :class="{
                        'element-selected': teamElements[idx]
                    }"
                    @click="$emit('toggleElement', idx)"
                >
                    <img
                        :src="getHsrElementIcon(element).src"
                        :title="element"
                    >
                </td>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(enemy, enemyIdx) in hsrEnemies"
                :key="enemy.name"
            >
                <td
                    :class="{
                        'weakness-covered': enemyCovered[enemyIdx]
                    }"
                >
                    {{ enemy.name }}
                </td>

                <td
                    v-for="(element, idx) in hsrElements"
                    :key="element"
                    :class="{
                        'element-selected': teamElements[idx]
                    }"
                >
                    <img
                        v-if="enemy.weaknesses[idx]"
                        :src="getHsrElementIcon(element).src"
                        :title="element"
                    >
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
td{
    vertical-align: middle;

    &:not(:last-child){
        border-right: 1px solid;
    }

    &:not(:first-child){
        width: 48px + (16px * 2);
    }

    &.clickable{
        cursor: pointer;
        transition: $transition;

        &:hover{
            background: $dark;
        }
    }

    &.center{
        text-align: center;
    }

    &.element-selected{
        background: $dark;
    }

    &.weakness-covered{
        background: darkgreen;
        border-color: $dark;
        color: white;
    }

    img{
        display: flex;
        margin: 0 auto;
    }
}
</style>
