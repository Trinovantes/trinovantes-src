<script lang="ts" setup>
import { useMeta } from 'vue-meta'
import ContactLinks from '../About/ContactLinks.vue'
import { APP_NAME, APP_DESC } from '@/common/Constants'
import { getProfilePicture } from '@/web/utils/ResponsiveImage'
import { createPageHeadOptions, TwitterCard } from '@/web/utils/createPageHeadOptions'

useMeta(createPageHeadOptions({
    title: APP_NAME,
    desc: APP_DESC,
    image: getProfilePicture().src,
    imageSize: TwitterCard.Summary,
}))
</script>

<template>
    <article class="home-page">
        <div class="container full-height-container">
            <h1 class="animate__animated animate__fadeInUp">
                {{ APP_NAME }}
            </h1>

            <h2 class="animate__animated animate__fadeInUp">
                {{ APP_DESC }}
            </h2>

            <ContactLinks
                class="animate__animated animate__fadeInUp"
                :is-dark="true"
            />
        </div>
    </article>
</template>

<style lang="scss" scoped>
article.home-page{
    background: lighten($dark, 10%);
    color: white;

    .container{
        padding-top: $padding * 2;
        padding-bottom: $padding * 2;

        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: $padding * 4;

        @media (max-width: $large-mobile-breakpoint) {
            gap: $padding * 3;
        }

        @media (max-width: $mobile-breakpoint) {
            gap: $padding * 2;
        }
    }

    h1{
        color: $primary-on-dark;
        font-size: 6rem;
        font-weight: 900;

        @media (max-width: $large-mobile-breakpoint) {
            font-size: 4.2rem;
        }

        @media (max-width: $mobile-breakpoint) {
            font-size: 3rem;
        }
    }

    h2{
        color: $text-on-dark;
        font-weight: normal;
        font-size: 3rem;

        @media (max-width: $large-mobile-breakpoint) {
            font-size: 2.4rem;
        }

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
