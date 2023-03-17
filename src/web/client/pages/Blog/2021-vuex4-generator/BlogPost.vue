<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent } from 'vue'
import VuexGenerator from './VuexGenerator.vue'

export const TITLE = 'Vuex 4 Typescript Declarations Generator'
export const CREATED_AT = dayjs.utc('2021-07-22').unix()
export const UPDATED_AT = dayjs.utc('2022-04-28').unix()

export default defineComponent({
    components: {
        VuexGenerator,
    },

    setup() {
        return {
            TITLE,
            CREATED_AT,
            UPDATED_AT,
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
        <div class="callout warning all-cols">
            <p>
                <strong>Update: Apr 28, 2022</strong>
                <br>
                <a href="https://vuejs.org/guide/scaling-up/state-management.html#pinia">Vuex is officially deprecated</a> and should not be used anymore.
                You should use Pinia instead which already has great Typescript support out of the box.
                Alternatively if your state is simple, you can simply use a global reactive object.
            </p>
        </div>

        <VuexGenerator class="all-cols" />

        <TextHeading>
            Motivation
        </TextHeading>

        <p>
            I've been using Vue 3 and Typescript for my personal side projects for awhile now. However, one of Vue's biggest weakness today is still its lack of comprehensive Typescript support. For example, its state management library, Vuex 4, still requires using strings as function names and <code>any</code> as payloads:
        </p>

        <CodeBlock
            :code="require('./raw/no-types-in-vuex.ts')"
            language="ts"
        />

        <p>
            Fortunately I've stumbled upon this <a href="https://dev.to/3vilarthas/vuex-typescript-m4j">solution</a>. Due to how verbose it is, I've built this tool to automate the repetitive boilerplate code for my future projects. Hopefully this tool will no longer be necessary by the time Vuex 5 is released.
        </p>

        <TextHeading :size="3">
            Vuex Modules
        </TextHeading>

        <p>
            While it should be possible to type modules with template literal types added in TS4.1, I don't think it's worth investigating because:
        </p>

        <ul>
            <li>
                Vuex modules will be <a href="https://github.com/kiaking/rfcs/blob/vuex-5/active-rfcs/0000-vuex-5.md">deprecated in Vuex 5</a>
            </li>
            <li>
                You can (and should) already be composing your Vuex state with multiple stores instead of nesting them like a tree.
            </li>
        </ul>
    </BlogPost>
</template>
