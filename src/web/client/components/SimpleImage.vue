<script lang="ts" setup>
import mediumZoom from 'medium-zoom'
import { onBeforeUnmount, onMounted, PropType, ref } from 'vue'
import { sleep } from '@/common/utils/sleep'
import type { ResponsiveImage } from '@/web/client/utils/ResponsiveImage'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
    img: {
        type: Object as PropType<ResponsiveImage>,
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
    sizes: {
        type: String,
        default: '100vw',
    },
    enableBorder: {
        type: Boolean,
        default: true,
    },
    enableZoom: {
        type: Boolean,
        default: true,
    },
})

// Set up lazy loading with intersection observer
const containerRef = ref<HTMLDivElement | null>(null)
const hasScrolledIntoView = ref(false)
let observer: IntersectionObserver | null = null
onMounted(() => {
    if (!containerRef.value) {
        throw new Error('Cannot find containerRef')
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

// Set up plugins on <img> after it loads
const imageRef = ref<HTMLImageElement | null>(null)
const isLoading = ref(true)
const onImageLoadSuccess = () => {
    if (!imageRef.value) {
        throw new Error('Missing imageRef')
    }

    isLoading.value = false

    if (props.enableZoom) {
        mediumZoom(imageRef.value)
    }
}

// Try to reload errored image once
let hasRetried = false
const onImageLoadError = async() => {
    if (!imageRef.value) {
        throw new Error('Missing imageRef')
    }

    if (hasRetried) {
        return
    }

    // Avoid rate limits
    await sleep(1000)

    imageRef.value.src = ''
    imageRef.value.src = props.img.src
    hasRetried = true
}
</script>

<template>
    <div
        ref="containerRef"
        class="simple-image"
    >
        <figure
            v-if="hasScrolledIntoView"
            :class="{
                border: enableBorder,
                loading: isLoading,
            }"
        >
            <picture
                :style="{
                    backgroundSize: 'cover',
                    backgroundImage: (isLoading && img.placeholder) ? `url('${img.placeholder}')` : 'none'
                }"
            >
                <source
                    :srcset="img.srcSet"
                    :sizes="sizes"
                >
                <img
                    ref="imageRef"
                    :src="img.src"
                    :width="(width ?? img.width) || undefined"
                    :height="(height ?? img.height) || undefined"
                    :sizes="sizes"
                    :title="title"
                    :alt="alt ?? title"
                    loading="lazy"
                    @load="onImageLoadSuccess"
                    @error="onImageLoadError"
                >
            </picture>

            <figcaption v-if="$slots.default">
                <slot />
            </figcaption>

            <LoadingSpinner
                v-if="isLoading"
            />
        </figure>
    </div>
</template>

<style lang="scss" scoped>
div.simple-image{
    display: flex;
    flex-direction: column;
    justify-content: start;
    position: relative;

    figure{
        &.border{
            border: 1px solid $dark;

            figcaption{
                border-top: 1px solid $dark;
            }
        }

        &.loading{
            min-height: 120px + ($padding * 2);
        }

        picture{
            display: block;

            img{
                display: block;
                margin: 0 auto;
                width: 100%; height: auto;
                max-width: 100%;
                object-fit: cover;
            }
        }

        figcaption{
            font-size: 1rem;
            font-style: italic;
            padding: $padding;
            text-align: center;
        }

        .spinner-wrapper{
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
