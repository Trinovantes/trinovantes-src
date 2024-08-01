<script lang="ts" setup>
import { APP_NAME } from '@/common/Constants'
</script>

<template>
    <header>
        <div class="container">
            <router-link to="/" class="home-btn">
                {{ APP_NAME }}
            </router-link>

            <div class="flex-1" />

            <nav>
                <router-link to="/about">
                    About
                </router-link>
                <router-link to="/blog">
                    Blog
                </router-link>
                <router-link to="/projects">
                    Projects
                </router-link>
            </nav>
        </div>
    </header>
</template>

<style lang="scss" scoped>
header{
    background: $dark;
    line-height: $header-line-height;

    .container{
        display: flex;
        padding-left: $padding;
        padding-right: $padding;

        @media (max-width: $mobile-breakpoint) {
            display: block;
            padding: 0;
        }
    }
}

a{
    text-decoration: none;
    transition: $transition;
}

a.home-btn{
    $border-color: rgba(#ccc, 0.2);

    color: white;
    font-size: 1.5rem;
    font-weight: 900;

    align-items: center;
    border-color: $border-color;
    display: flex;
    padding: $padding;

    &:hover{
        color: $primary-on-dark;
    }

    @media (max-width: $mobile-breakpoint) {
        border-bottom: 1px solid $border-color;
        justify-content: center;
        padding: $padding * 2;
    }
}

nav{
    display: flex;
    overflow: hidden;

    a{
        color: $text-on-dark;
        font-size: 1rem;
        font-weight: bold;
        line-height: $header-height;
        text-align: center;

        display: block;
        flex: 1;
        padding: 0 $padding;
        position: relative;

        &:after{
            opacity: 0;

            background: $primary-on-dark;
            content: '';
            display: block;
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: math.div($padding, 4);
        }

        &.router-link-exact-active,
        &:hover{
            color: $primary-on-dark;

            &:after{
                opacity: 1;
            }
        }

        &:not(.router-link-exact-active):hover{
            &:after{
                animation-name: fadeInDown;
                animation-duration: 0.5s;
            }
        }
    }
}
</style>
