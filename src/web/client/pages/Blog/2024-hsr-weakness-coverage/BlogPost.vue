<script lang="ts">
import { defineComponent, ref } from 'vue'
import HsrWeaknessCoverage from './HsrWeaknessCoverage.vue'
import { chooseFromSet } from './chooseFromSet'
import { getHsrElementIcon, hsrElements, hsrEnemies } from './HsrData'

export const TITLE = 'Optimal Honkai Star Rail Enemy Weakness Coverage'
export const CREATED_AT = new Date('2024-03-30').getTime()
export const UPDATED_AT = new Date('2024-07-04').getTime()

const hasFullCoverage = (elementIdxs: Array<number>) => {
    for (const enemy of hsrEnemies) {
        let elementsCovered = 0

        for (let i = 0; i < enemy.weaknesses.length; i++) {
            if (enemy.weaknesses[i] && elementIdxs.includes(i)) {
                elementsCovered++
            }
        }

        if (elementsCovered === 0) {
            return false
        }
    }

    return true
}

export default defineComponent({
    components: {
        HsrWeaknessCoverage,
    },

    setup() {
        const currentTeamElements = ref<Array<boolean>>(hsrElements.map(() => false))
        const toggleElement = (elementIdx: number) => {
            currentTeamElements.value[elementIdx] = !currentTeamElements.value[elementIdx]
        }

        const allFourElementTeam = chooseFromSet([...Array(hsrElements.length).keys()], 4).filter(hasFullCoverage)
        const selectFourElementTeam = (teamIdx: number) => {
            currentTeamElements.value = hsrElements.map((_, elementIdx) => allFourElementTeam[teamIdx].includes(elementIdx))
        }

        return {
            TITLE,
            CREATED_AT,
            UPDATED_AT,

            hsrElements,
            getHsrElementIcon,

            currentTeamElements,
            toggleElement,

            allFourElementTeam,
            selectFourElementTeam,
        }
    },
})
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
        :updated-at="UPDATED_AT"
    >
        <p>
            I recently started playing Honkai Star Rail (HSR), a popular turn-based RPG by Mihoyo.
        </p>

        <p>
            Enemies in HSR have a mechanic known as the “toughness bar”.
            While their toughness is full, enemies receive reduced damage thus we would like to break these bars to our maximize damage.
            To break enemies' toughness, we would need to damage them with characters that match their elemental weaknesses.
        </p>

        <p>
            In an ideal world, we would simply have characters of every element to achieve full coverage.
            However, since HSR is a gacha game, it is impossible to access every character without spending an exorbitant amount of money.
            This led me to wonder: <strong>What is the minimum number of characters needed to cover every elite enemy's weakness?</strong>
            (We're going to ignore non-elites since they can be easily killed without breaking their toughness bar)
        </p>

        <p>
            To help answer this question, I built this tool to check which enemies are covered by which elements.
            You can click the element icons in the table header to indicate that you own characters with said elements and the table will automatically update to show which enemies are covered.
        </p>

        <p>
            Finally, we can use simple brute force to answer our original question: <strong>We would need at least four different elements to cover every enemy</strong> (as of patch 2.3).
        </p>

        <div class="grid-3 popout">
            <div
                v-for="(team, idx) in allFourElementTeam"
                :key="team.join(',')"
                class="team"
                @click="selectFourElementTeam(idx)"
            >
                <img
                    v-for="elementIdx of team"
                    :key="elementIdx"
                    :src="getHsrElementIcon(hsrElements[elementIdx]).src"
                >
            </div>
        </div>

        <HsrWeaknessCoverage
            :team-elements="currentTeamElements"
            @toggle-element="toggleElement"
        />
    </BlogPost>
</template>

<style lang="scss" scoped>
.team{
    border: 1px solid $light-on-light;
    cursor: pointer;
    padding: $padding;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition;

    &:hover{
        border-color: $dark;
    }
}
</style>
