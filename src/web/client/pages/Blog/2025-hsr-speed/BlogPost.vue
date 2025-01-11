<script lang="ts" setup>
import HsrSpeedTable from './HsrSpeedTable.vue'
import HsrSpeedCalculator from './HsrSpeedCalculator.vue'

const TITLE = 'Honkai Star Rail Speed Stat and Breakpoints'
const CREATED_AT = new Date('2025-01-10').getTime()
const UPDATED_AT = new Date('2025-01-13').getTime()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
        :updated-at="UPDATED_AT"
    >
        <p>
            If you've been following my blog posts and side projects recently, you may have noticed I've been playing Honkai Star Rail (HSR).
            Its turn-based combat system is extremely interesting and fun for me.
            After playing the game for a bit over a year, I'm now looking to meta-game the combat system to try and optimize my endgame battles.
        </p>

        <p>
            One of the most important stat in any turn-based RPG is the speed (Spd) stat.
            While it's simple to just get as much of it as possible, every stat including Spd in HSR has an opportunity cost i.e. I can either get more Spd or more Crit but not both.
        </p>

        <TextHeading>
            What is Speed?
        </TextHeading>

        <p>
            In order to help me optimize my characters' Spd stats, I first need to understand what it actually means.
            As it turns out, Spd is just the more convenient definition of the real underlying stat: Action Value (AV).
        </p>

        <MathBlock
            tex="\text{AV}=\frac{10000}{\text{Spd}}"
        />

        <p>
            Every character and enemy in the game has an Spd or rather AV stat.
            For example, a character with 160 Spd really just has 62.5 AV.
        </p>

        <p>
            Why not just show AV instead of Spd?
            I think it makes sense from a UX perspective to present the user with Spd rather than AV because otherwise AV would be the only character stat that you would want as little as possible.
        </p>

        <TextHeading>
            What is the Significance of Action Value?
        </TextHeading>

        <p>
            In HSR combat, AV can be thought of as the time interval between turns.
            For example, a character with 50 AV (200 Spd) would take turns at time <MathInline tex="t=50" /> and then at time <MathInline tex="t=100" />.
            Likewise, a character with 62.5 AV (160 Spd) would take turns at time <MathInline tex="t=62.5" /> and then at time <MathInline tex="t=125" />.
        </p>

        <HsrSpeedCalculator />

        <TextHeading :size="3">
            How the Game uses Action Value
        </TextHeading>

        <ol>
            <li>
                Every character is initialized to their default AV.
            </li>
            <li>
                The game sorts the characters by lowest AV first and checks the next character's AV.
                If there are multiple characters that are scheduled to act at the same time, characters are sorted based on their position in the team with leftmost character first.

                <ul>
                    <li>
                        If the next character has an AV of 0, then it is ready to take its turn.
                        After it takes its turn, its AV is reset back to its initial value based on the character's current Spd.
                    </li>
                    <li>
                        If the next character has an AV greater than 0, the game advances everyone's AV by the next character's AV
                        (i.e. subtract the next character's AV from everyone so that the next character will have an AV of 0).
                    </li>
                </ul>
            </li>
            <li>
                Repeat Step 2 until all enemies are defeated.
            </li>
        </ol>

        <SimpleImage
            :img="require('./img/av-settings.png')"
        >
            There is an option in the game settings that enables showing each character's AV in the timeline on the left side.
        </SimpleImage>

        <div class="grid-2">
            <SimpleImage
                :img="require('./img/av-in-combat-before.jpg')"
            >
                At the start of battle, each character is initialized to their default AV.
            </SimpleImage>
            <SimpleImage
                :img="require('./img/av-in-combat-after.jpg')"
            >
                Since nobody is ready yet, the game advances by 44 AV.
                Note that there are some hidden decimals that caused the 58 to go to 15 instead of 14.
            </SimpleImage>
        </div>

        <TextHeading :size="3">
            Action Advance in Combat
        </TextHeading>

        <p>
            Whenever a character gets "action advanced by X%", it means advancing its AV by its default AV multipled by the advance percentage (until its AV reaches 0).
        </p>

        <MathBlock
            tex="\text{AV}_\text{After} = \max \left \{0, \text{AV}_\text{Before} - \text{Adv} \cdot \frac{10000}{\text{Spd}} \right\}"
        />

        <p>
            For example in the above screenshot, my Ruan Mei (first character) has an initial speed of 138 giving her 72.5 AV.
            However since she is also equipped with Vonwacq set bonus, she is action advanced by 40% at the start of battle thus advancing her AV to <MathInline tex="72.5 - 0.4 \cdot 72.5 = 43.5" /> (the screenshot rounds up to 44).
        </p>

        <TextHeading :size="3">
            Speed Changes in Combat
        </TextHeading>

        <p>
            Whenever a character gets a Spd buff in combat, its current AV is updated based on the following formula:
        </p>

        <MathBlock
            tex="\text{AV}_\text{After} = \text{AV}_\text{Before} \cdot \frac{\text{Spd}_\text{Old}}{\text{Spd}_\text{New}}"
        />

        <p>
            For example, if a character with 160 Spd somehow gets an additional 40 Spd at the start of combat (making them effectively 200 Spd), their initial AV will instead be <MathInline tex="62.5 \cdot \frac{160}{200} = 50" />.
        </p>

        <TextHeading>
            Optimizing Speed
        </TextHeading>

        <p>
            One of the endgame modes in HSR is Memory of Chaos (MOC) where players have to defeat all the enemies in a certain amount of time.
            We measure our performance in MOC based on how many "cycles" it takes to clear all the enemies.
            One cycle is equivalent to advancing 100 AV, with the exception of the first cycle which has 150 AV.
        </p>

        <p>
            For example, clearing MOC in 150 AV or less is considered "0 cycle".
            Likewise, clearing MOC in 250 AV or less is considered "1 cycle" (I have no idea why players decided to start counting at 0).
            If we want to clear within 250 AV or "1 cycle", we would want either 160 Spd (62.5 AV) for 4 turns or 200 Spd (50 AV) for 5 turns.
            Any Spd stats between 160 and 200 would be considered a waste since that extra Spd would not allow us to take an extra turn.
        </p>

        <p>
            I built this table to help me check how much Spd I need to reach certain breakpoints based on my targeted number of cycles and turns.
        </p>

        <HsrSpeedTable />
    </BlogPost>
</template>
