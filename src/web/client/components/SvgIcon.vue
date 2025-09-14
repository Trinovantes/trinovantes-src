<script lang="ts" setup>
import { getIconSvgRaw } from '../utils/ResponsiveLoaderAsset.ts'

defineProps<{
    name: string
    isDark?: boolean
}>()
</script>

<template>
    <div
        :class="{
            ['svg-wrapper']: true,
            [name]: true,
            dark: isDark,
        }"
        v-html="getIconSvgRaw(name)"
    />
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
