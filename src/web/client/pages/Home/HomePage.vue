<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import ContactLinks from '../About/ContactLinks.vue'
import { APP_NAME, APP_DESC } from '@/common/Constants'

useSeoMeta({
    title: APP_NAME,
    description: APP_DESC,
})
</script>

<template>
    <article class="home-page">
        <div class="container">
            <h1>
                {{ APP_NAME }}
            </h1>

            <h2>
                {{ APP_DESC }}
            </h2>

            <ContactLinks
                :is-dark="true"
            />
        </div>
    </article>
</template>

<style lang="scss" scoped>
article.home-page{
    background: lighten($dark, 10%);
    color: white;
    display: grid;
    align-items: center;

    .container{
        padding-top: $padding * 2;
        padding-bottom: $padding * 2;

        display: grid;
        gap: $padding * 4;

        @media (max-width: $mobile-breakpoint) {
            gap: $padding * 2;
        }
    }

    h1{
        color: $primary-on-dark;
        font-size: 6rem;
        font-weight: 900;

        @media (max-width: $mobile-breakpoint) {
            font-size: 3rem;
        }
    }

    h2{
        color: $text-on-dark;
        font-weight: normal;
        font-size: 3rem;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1.5rem;
        }
    }

    a{
        font-size: 1.5rem;
        line-height: $padding * 2;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1rem;
            line-height: 1;
        }
    }
}
</style>
