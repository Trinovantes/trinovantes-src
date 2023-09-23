<script lang="ts" setup>
import { getIconSvgRaw } from '../utils/ResponsiveLoaderAsset'

defineProps<{
    name: string
    isDark?: boolean
}>()
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div :class="`svg-wrapper ${isDark ? 'dark' : ''} ${name}`" v-html="getIconSvgRaw(name)" />
</template>

<style lang="scss">
.svg-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;

    svg{
        width: $icon-size;
        height: $icon-size;
    }

    &.email{
        svg{
            fill: $dark;
        }
    }

    &.github,
    &.twitter{
        path{
            fill: $dark;
        }
    }
}

.dark{
    .svg-wrapper{
        &.email{
            svg{
                fill: white;
            }
        }

        &.github,
        &.twitter{
            path{
                fill: white;
            }
        }
    }
}
</style>
