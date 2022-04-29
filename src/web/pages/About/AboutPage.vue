<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { APP_DESC } from '@/common/Constants'
import ContactLinks from '@/web/components/ContactLinks/ContactLinks.vue'
import { createPageHeadOptions, TwitterCard } from '@/web/utils/PageHeadOptions'
import { getProfilePicture } from '@/web/utils/ResponsiveLoader'

const title = 'About'
const desc = `Hi, I'm Stephen. ${APP_DESC}`
useMeta(createPageHeadOptions({
    title,
    desc,
    image: getProfilePicture().src,
    imageSize: TwitterCard.Summary,
}))

const startedProgramming = 2004 // Grade 6
const yearsSinceStartedProgramming = ref<string | undefined>(undefined)
onMounted(() => {
    yearsSinceStartedProgramming.value = `${new Date().getFullYear() - startedProgramming} years ago!`
})
</script>

<template>
    <article class="container text-container with-sidebar">
        <h1 class="all-cols">
            {{ title }}
        </h1>

        <section>
            <p>
                {{ desc }}
            </p>

            <p>
                I got interested in programming back in <em :title="yearsSinceStartedProgramming">grade 6</em> when I found a "How to build your own website" book from my local library.
            </p>

            <p>
                I completed my Bachelor of Software Engineering (<strong>B.SE</strong>) in 2016 from University of Waterloo.
                I then studied under <a href="https://patricklam.ca">Patrick Lam</a> and received my Masters of Mathematics (<strong>MMath</strong>) in 2019.
                My <a href="https://github.com/Trinovantes/masters">masters thesis</a> explores the process of automating student assignment grading through static analysis in LLVM.
            </p>

            <h2>Interesting stuff I've done in school:</h2>

            <ul>
                <li>Built the frontend for <a href="https://github.com/SanaMobile/sana.protocol_builder">Sana medical procedure editor</a> using Backbone.js and Marionette.js for my undergrad capstone project (2015-2016)</li>
                <li>Wrote a ray tracer with refractions, bounded volume hierarchy optimization, depth of field, soft shadows, texture and bump mapping, etc. (July 2015)</li>
                <li>Wrote an OS kernel for a Cortex M3 board (Mar 2014)</li>
                <li>Wrote a MIPS compiler and assembler for a subset of C (Nov 2012)</li>
                <li>Built a <a href="https://github.com/Trinovantes/2D-Shooter">2D scrolling shooter game</a> with C# and XNA (June 2011)</li>
                <li>Served as my high school yearbook's Editor-in-Chief (2010-2011)</li>
            </ul>

            <h2>Internships during my undergrad:</h2>

            <p>
                During my undergrad, I've alternated between four months of school and four months of internships (co-ops).
                This allowed me to gain real-world experience and to apply the theoretical concepts learned in class.
            </p>

            <ul>
                <li>Rocscience (Jan 2015 - Apr 2015)</li>
                <li>Lookout (May 2014 - Aug 2014)</li>
                <li>IBM (Sept 2013 - Dec 2013)</li>
                <li>500px (Jan 2013 - Apr 2013)</li>
                <li>Pilot Interactive (May 2012 - Aug 2012)</li>
            </ul>
        </section>

        <aside>
            <SimpleImage
                :img="require('@/web/assets/img/profile.jpg?size=400')"
                :enable-zoom="false"
                :enable-background="false"
                :round-image="true"
                title="Stephen Li"
            />

            <ContactLinks />
        </aside>
    </article>
</template>

<style lang="scss" scoped>
.text-container{
    @media (max-width: $text-container-breakpoint) {
        aside {
            grid-row-start: 2;
        }
    }

    aside{
        gap: $column-gap;

        .contact{
            margin: 0 auto;
            width: -moz-fit-content;
            width: fit-content;
        }
    }
}
</style>
