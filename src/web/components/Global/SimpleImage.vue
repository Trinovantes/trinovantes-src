<script lang="ts" setup>
import mediumZoom from 'medium-zoom'
import { onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { ResponsiveImage } from '@/web/utils/ResponsiveLoader'
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
    roundImage: {
        type: Boolean,
        default: false,
    },
    enableBackground: {
        type: Boolean,
        default: true,
    },
    enableAnimation: {
        type: Boolean,
        default: false,
    },
    enableZoom: {
        type: Boolean,
        default: true,
    },
})

const containerRef = ref<HTMLDivElement | null>(null)
const hasScrolledIntoView = ref(false || DEFINE.IS_SSR)

// Set up intersection observer
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

// Set up image loading
const imageRef = ref<HTMLImageElement | null>(null)
const showLoading = ref(true && !DEFINE.IS_SSR)
onMounted(() => {
    watch(imageRef, () => {
        if (!imageRef.value) {
            return
        }

        // Don't set onload hook more than once
        if (imageRef.value.onload) {
            return
        }

        showLoading.value = !imageRef.value.complete

        imageRef.value.onload = () => {
            showLoading.value = false
        }
    }, {
        immediate: true,
    })
})

// Set up animation
onMounted(() => {
    watch(hasScrolledIntoView, () => {
        if (!props.enableAnimation) {
            return
        }

        if (!hasScrolledIntoView.value) {
            return
        }

        containerRef.value?.classList.add('animate__animated')
        containerRef.value?.classList.add('animate__fadeInUp')
    }, {
        immediate: true,
    })
})

// Set up medium zoom
onMounted(() => {
    watch(imageRef, () => {
        if (!props.enableZoom) {
            return
        }

        if (!imageRef.value) {
            return
        }

        mediumZoom(imageRef.value)
    }, {
        immediate: true,
    })
})
</script>

<template>
    <div
        ref="containerRef"
        class="simple-image"
    >
        <figure
            v-if="hasScrolledIntoView"
            :class="{
                background: enableBackground,
            }"
        >
            <picture
                :style="{
                    backgroundSize: 'cover',
                    backgroundImage: (showLoading && img.placeholder) ? `url('${img.placeholder}')` : 'none'
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
                    :class="{
                        round: roundImage,
                    }"
                >
            </picture>

            <figcaption v-if="$slots.default">
                <slot />
            </figcaption>

            <LoadingSpinner
                v-if="showLoading"
            />
        </figure>
    </div>
</template>

<style lang="scss" scoped>
div.simple-image{
    display: flex;
    flex-direction: column;
    justify-content: start;

    figure{
        margin: 0;
        position: relative;

        &.background{
            background: #f6f6f6;
            padding: $padding * 2;
        }

        picture{
            display: block;

            img{
                display: block;
                margin: 0 auto;
                max-width: 100%; height: auto;
                object-fit: cover;

                &.round{
                    border-radius: 50%;
                }
            }
        }

        figcaption{
            font-size: 90%;
            font-style: italic;
            margin-top: $padding;
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
