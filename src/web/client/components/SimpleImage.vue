<script lang="ts" setup>
import mediumZoom from 'medium-zoom'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ResponsiveLoaderAsset } from '@/web/client/utils/ResponsiveLoaderAsset'

const props = withDefaults(defineProps<{
    img: ResponsiveLoaderAsset
    title?: string
    alt?: string
    aspectRatio?: number
    enableZoom?: boolean
    enableBorder?: boolean
}>(), {
    title: '',
    alt: '',
    aspectRatio: 1 / 1.618,
    enableZoom: true,
    enableBorder: true,
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
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const onImageLoadSuccess = () => {
    if (!imageRef.value) {
        throw new Error('Cannot find imageRef')
    }

    naturalWidth.value = imageRef.value.naturalWidth
    naturalHeight.value = imageRef.value.naturalHeight

    if (props.enableZoom) {
        mediumZoom(imageRef.value)
    }
}

const paddingTop = computed<string>(() => {
    let aspectRatio = props.aspectRatio

    if (naturalWidth.value > 0 && naturalHeight.value > 0) {
        aspectRatio = naturalHeight.value / naturalWidth.value
    }

    return `${aspectRatio * 100}%`
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
                :title="title"
                :alt="alt ?? title"
                loading="lazy"
                referrerpolicy="no-referrer"
                @load="onImageLoadSuccess"
            >
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
            object-fit: cover;
            object-position: center;
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
