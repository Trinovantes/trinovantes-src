<script lang="ts">
import { defineComponent } from 'vue'

export const TITLE = 'How Much Do Whales Spend in Honkai Impact?'
export const CREATED_AT = new Date('2023-10-31').getTime()

export default defineComponent({
    setup() {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        })

        const exchangeRate = 0.14
        const gemsPerPull = 280
        const gemsInBundle = 8088
        const costOfBundle = 99.99
        const costPerPull = costOfBundle / gemsInBundle * gemsPerPull

        return {
            TITLE,
            CREATED_AT,

            currency: (amount: number) => formatter.format(amount),
            rmbToUsd: (rmbWan: number) => `$${(rmbWan * 10000 * exchangeRate / 1e6).toFixed(0)}M`,
            calcNumPulls: (pity: number) => (300 - ((50 / 210) * pity)) / ((50 / 210) + (30 / pity)) + pity,

            gemsPerPull,
            gemsInBundle,
            costOfBundle,
            costPerPull,
        }
    },
})
</script>

<template>
    <BlogPost
        :title="TITLE"
        :image="require('./img/luna.png').src"
        :created-at="CREATED_AT"
    >
        <p>
            Honkai Impact is a hack-and-slash mobile game released back in 2016 &mdash; not to be confused with Honkai Star Rail created by the same company, miHoYo, released earlier this year.
            Like many other mobile games, it is free-to-play with an optional gatcha cash shop.
        </p>

        <p>
            Although it is not as popular anymore and is dwarfed by miHoYo's other games Genshin Impact and Honkai Star Rail, it still holds a special place in my heart as I frequently come back every patch to check out what's new in the story.
        </p>

        <SimpleImage :img="require('./img/luna.png')">
            Patch 7.0's New Character: Luna
        </SimpleImage>

        <p>
            Last week, Honkai Impact released patch 7.0 on its global servers.
            Since the Chinese server is one patch ahead of the global server, I checked out the sales rankings for Oct 2023 to see how well it performed in China.
            According to this <a href="https://www.bilibili.com/video/BV1gu4y1J7zc">source</a>, Honkai Impact generated approximately {{ rmbToUsd(5154) }} USD.
        </p>

        <p>
            <strong>For Reference:</strong>
        </p>
        <ul>
            <li>
                Diablo Immortal generated {{ rmbToUsd(2837) }}
            </li>
            <li>
                Class of Clans generated {{ rmbToUsd(13400) }}
            </li>
            <li>
                Genshin Impact generated {{ rmbToUsd(74000) }}
            </li>
            <li>
                League of Legends Wild Rift generated {{ rmbToUsd(76600) }}
            </li>
            <li>
                Honkai Star Rail generated {{ rmbToUsd(80700) }}
            </li>
            <li>
                Honor of Kings (first place) generated {{ rmbToUsd(367400) }}
            </li>
        </ul>

        <p>
            To my surprise, although Honkai Impact's revenue is less than 2% of first place, it still hovers around the median.
            Considering that most mobile games don't last more than a few years before shutting down whereas Honkai is celebrating its 7th anniversary this year, hovering around the median is actually pretty good news.
        </p>

        <p>
            This led me to wonder how much the die-hard fans of a 7-year-old must spend to keep this game alive for this long.
        </p>

        <TextHeading>
            Gatcha
        </TextHeading>

        <p>
            In every patch, a new character and their corresponding equipment is released.
            In most patches, the character and their equipment can only be obtained by "pulling" loot boxes in the gatcha cash shop (character and equipment drops from different loot boxes with separate pity counters).
            Each pull costs {{ gemsPerPull }} gems which must be purchased through bundles.
            The most cost-efficient bundle costs {{ currency(costOfBundle) }} for {{ gemsInBundle }} gems or approximately {{ currency(costPerPull) }} per pull.
        </p>

        <TextHeading :size="3">
            Obtaining the Character
        </TextHeading>

        <p>
            The first step of our analysis is the cost to obtain the character itself.
            Each pull has 1.5% chance of obtaining the character with a <a href="https://www.reddit.com/r/houkai3rd/comments/lxkuq8/soft_pity_after_75_pulls_in_valkyrie_expansion_a/">soft pity at 70</a> pulls and hard pity at 100 pulls, i.e. we are guaranteed to receive the character on our 100th pull.
            To keep the analysis simple, we will just assume it takes 100 pulls to obtain the character although in practice it is very rare to actually need all 100 pulls.
        </p>

        <p>
            Each character starts at S-Rank and can be further upgraded to SSS-Rank though "fragments".
            For most players, S-Rank is good enough for everything except reaching the absolute top of the leaderboards.
            Since we are interested in how much money whales spend on this game, we will instead calculate the cost to obtain an SSS-Rank character.
            To fully upgrade to SSS-Rank, we will need another 300 fragments after obtaining the character.
        </p>

        <p>
            There are two ways to obtain fragments for newly released characters:
        </p>

        <ul>
            <li>
                Each pull gives 50/210 fragments.
                This funny number is due to an additional in-game currency conversion that I will spare from you.
                Recall since we need 100 pulls for our initial S-Rank, we automatically start with 50/210 &times; 100 (~23.8) fragments.
            </li>
            <li>
                Every duplicate character is converted to 30 fragments.
                After obtaining a character, the pity counter resets to 0.
                In other words, we get an additional 30 fragments every 100 pulls.
            </li>
        </ul>

        <p>
            Putting everything together, we get this equation to determine the number of additional pulls <MathInline tex="p" /> needed for an SSS-Rank character:
        </p>

        <MathBlock
            tex="(\frac{50}{210} \cdot 100) + (\frac{50}{210} \cdot p) + (30 \cdot \frac{1}{100} \cdot p) = 300"
        />

        <p>
            Solving for <MathInline tex="p" /> gives us {{ Math.round(calcNumPulls(100) - 100) }} pulls to go from S-Rank to SSS-Rank or {{ Math.round(calcNumPulls(100)) }} in total.
            With each pull costing {{ currency(costPerPull) }}, it would cost a grand total of {{ currency(costPerPull * calcNumPulls(100)) }}
            In practice however, it would cost slightly less with soft pity kicking in after 70 pulls.
        </p>

        <SimpleTable
            :data="[
                ['Character Obtained After n Pulls', 'Total Pulls for SSS-Rank', 'Cost'],
                ['70', Math.round(calcNumPulls(70)), currency(calcNumPulls(70) * costPerPull)],
                ['80 (average case?)', Math.round(calcNumPulls(80)), currency(calcNumPulls(80) * costPerPull)],
                ['90', Math.round(calcNumPulls(90)), currency(calcNumPulls(90) * costPerPull)],
                ['100 (worst case)', Math.round(calcNumPulls(100)), currency(calcNumPulls(100) * costPerPull)],
            ]"
        />

        <TextHeading :size="3">
            Obtaining the Equipment
        </TextHeading>

        <SimpleImage :img="require('./img/gear.png')">
            Equipment for Luna
        </SimpleImage>

        <p>
            After obtaining the character, we still need to obtain four pieces of unique equipment.
            Each piece has 1.240% to 2.479% chance of dropping with a hard pity of 50 pulls each.
            This means that it would take 200 pulls in the worst-case scenario.
            In practice based on testimony from other players on Reddit and Discord, it usually takes 120 pulls to get everything.
        </p>

        <SimpleTable
            :data="[
                ['Pulls', 'Cost'],
                ['120 (average case)', currency(120 * costPerPull)],
                ['200 (worst case)', currency(200 * costPerPull)],
            ]"
        />

        <TextHeading>
            Conclusion
        </TextHeading>

        <p>
            <strong>TLDR:</strong> A whale on Honkai Impact's global servers might spend somewhere between $2300 to $2800 every patch.
            With 9 patches every year, they will have to spend between $20K to $25K per year if they wish to stay at the top of the leadeboards.
        </p>
    </BlogPost>
</template>
