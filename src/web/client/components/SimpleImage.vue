<script lang="ts" setup>
import mediumZoom from 'medium-zoom'
import { computed, onBeforeUnmount, onMounted, PropType, ref } from 'vue'
import type { ResponsiveLoaderAsset } from '@/web/client/utils/ResponsiveLoaderAsset'
import LoadingSpinner from './LoadingSpinner.vue'
import type { Property } from 'csstype'

const props = defineProps({
    img: {
        type: Object as PropType<ResponsiveLoaderAsset>,
        required: true,
    },
    title: {
        type: String as PropType<string | undefined>,
        default: undefined,
    },
    alt: {
        type: String as PropType<string | undefined>,
        default: undefined,
    },
    width: {
        type: Number as PropType<number | undefined>,
        default: undefined,
    },
    height: {
        type: Number as PropType<number | undefined>,
        default: undefined,
    },
    objectFit: {
        type: String as PropType<Property.ObjectFit>,
        default: 'cover',
    },
    objectPosition: {
        type: String as PropType<Property.ObjectPosition<`${number}px`>>,
        default: 'center',
    },
    aspectRatio: {
        type: Number,
        default: 1 / 1.618,
    },
    keepAspectRatio: {
        type: Boolean,
        default: true,
    },
    enableZoom: {
        type: Boolean,
        default: true,
    },
    enableBorder: {
        type: Boolean,
        default: true,
    },
})

// Set up intersection observer
const containerRef = ref<HTMLDivElement | null>(null)
const hasScrolledIntoView = ref(false)
let observer: IntersectionObserver | null = null
onMounted(() => {
    if (!containerRef.value) {
        throw new Error('Cannot find containerRef')
    }
    if (!(containerRef.value instanceof Element)) {
        throw new Error(`containerRef is not an Element: ${typeof containerRef.value}`)
    }

    observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
            return
        }

        hasScrolledIntoView.value = true
        observer?.disconnect()
    })
    observer.observe(containerRef.value)
})
onBeforeUnmount(() => {
    observer?.disconnect()
})

const imageRef = ref<HTMLImageElement | null>(null)
const realImgWidth = ref(0)
const realImgHeight = ref(0)
const onImageLoadSuccess = () => {
    if (!imageRef.value) {
        throw new Error('Cannot find imageRef')
    }

    realImgWidth.value = imageRef.value.naturalWidth
    realImgHeight.value = imageRef.value.naturalHeight

    if (props.enableZoom) {
        mediumZoom(imageRef.value)
    }
}

const paddingTop = computed<string>(() => {
    if (props.height !== undefined) {
        return `${props.height}px`
    }

    if (props.keepAspectRatio) {
        const aspectRatio = realImgWidth.value > 0
            ? (realImgHeight.value / realImgWidth.value)
            : props.aspectRatio

        return props.width === undefined
            ? `${aspectRatio * 100}%`
            : `${aspectRatio * props.width}px`
    }

    return `${props.aspectRatio * 100}%`
})
</script>

<template>
    <figure
        ref="containerRef"
        :class="{
            border: enableBorder,
        }"
    >
        <picture
            :style="{ paddingTop }"
        >
            <img
                v-if="hasScrolledIntoView"
                ref="imageRef"
                :src="img.src"
                :width="width || undefined"
                :height="height || undefined"
                :title="title"
                :alt="alt ?? title"
                :style="{
                    objectFit,
                    objectPosition,
                }"
                loading="lazy"
                referrerpolicy="no-referrer"
                @load="onImageLoadSuccess"
            >
            <LoadingSpinner
                v-else
                class="loading-spinner"
            />
        </picture>

        <figcaption v-if="$slots.default">
            <slot />
        </figcaption>
    </figure>
</template>

<style lang="scss" scoped>
figure{
    &.border{
        picture{
            border: 1px solid $dark;
        }

        figcaption{
            border: 1px solid $dark;
            border-top: none;
        }
    }

    picture{
        display: block;
        position: relative;
        width: 100%;

        img{
            display: block;
        }

        img,
        .loading-spinner{
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
        }
    }

    figcaption{
        font-size: 1rem;
        line-height: 1.5;
        padding: $padding;
        text-align: center;
    }
}
</style>
