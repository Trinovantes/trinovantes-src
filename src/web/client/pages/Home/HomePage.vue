<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import ContactLinks from '../About/ContactLinks.vue'
import { APP_DESC, APP_NAME } from '../../../../common/Constants.ts'

useSeoMeta({
    title: APP_NAME,
    description: APP_DESC,
})
</script>

<template>
    <article class="home-page">
        <div class="container">
            <h1>
                {{ APP_DESC }}
            </h1>

            <ContactLinks
                :is-dark="true"
            />
        </div>
    </article>
</template>

<style lang="scss" scoped>
article.home-page{
    background: $dark;
    color: white;
    display: grid;
    align-items: center;

    .container{
        padding-top: $padding * 2;
        padding-bottom: $padding * 2;

        display: grid;
        gap: $padding * 2;

        @media (max-width: $mobile-breakpoint) {
            gap: $padding * 2;
        }
    }

    h1{
        color: $text-on-dark;
        font-weight: normal;
        font-size: 2rem;
        line-height: 1.5;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1.5rem;
        }
    }

    a{
        font-size: 1.5rem;
        line-height: 1;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1rem;
        }
    }
}
</style>
