<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { formatDate, formatDateDisplay } from '@/common/utils/formatDate'

const props = defineProps<{
    title: string
    image?: string
    createdAt: number
    updatedAt?: number
}>()

useSeoMeta({
    title: props.title,
    ogImage: props.image,
    twitterCard: 'summary_large_image',
})

type DateInfo = {
    date: string
    label: string
}

const dateInfos = computed<Array<DateInfo>>(() => {
    const dateInfos: Array<DateInfo> = [
        {
            date: formatDate(props.createdAt),
            label: `Published on ${formatDateDisplay(props.createdAt)}`,
        },
    ]

    if (props.updatedAt !== undefined) {
        dateInfos.push({
            date: formatDate(props.updatedAt),
            label: `Updated on ${formatDateDisplay(props.updatedAt)}`,
        })
    }

    return dateInfos
})

const progressRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const showProgress = ref(false)
const progress = ref('0%')
const updateProgress = () => {
    const startPosition = contentRef.value?.offsetTop ?? 0
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight - startPosition
    const scrollPosition = document.documentElement.scrollTop - startPosition
    const scrollProgress = scrollPosition / totalHeight * 100

    showProgress.value = totalHeight > 0 && scrollProgress > 0
    progress.value = `${scrollProgress}%`
}

onMounted(() => {
    window.addEventListener('scroll', updateProgress)
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
    <article class="blog-post">
        <div
            v-if="showProgress"
            ref="progressRef"
            class="progress"
        />

        <div
            class="hero-unit"
            :style="{
                'background-image': image ? `url('${image}')` : undefined
            }"
        >
            <div
                class="title"
                :class="{
                    'has-image': Boolean(image),
                }"
            >
                <div class="post-container">
                    <h1>
                        {{ title }}
                    </h1>
                </div>
            </div>

            <div class="meta">
                <div class="post-container">
                    <aside class="flex-hgap">
                        <time
                            v-for="dateInfo of dateInfos"
                            :key="dateInfo.date"
                            :datetime="dateInfo.date"
                        >
                            {{ dateInfo.label }}
                        </time>
                    </aside>
                </div>
            </div>
        </div>

        <div
            ref="contentRef"
            class="post-container text-container"
        >
            <slot />
        </div>
    </article>
</template>

<style lang="scss" scoped>
.progress{
    position: sticky;
    top: 0;
    z-index: 1;

    background: $primary;
    width: v-bind(progress);
    height: math.div($padding, 2);
}

.hero-unit{
    background-color: lighten($dark, 10%);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    .title{
        &:not(.has-image){
            padding: ($padding * 2) 0;
        }

        &.has-image{
            padding: $vspace 0;

            h1{
                background: rgba($dark, 0.6);
            }
        }

        h1{
            color: white;
            text-shadow: 0 math.div($padding, 8) math.div($padding, 4) rgba($dark, 0.8);

            margin: 0 (-$padding * 2);
            padding: $padding * 2;
        }
    }

    .meta{
        background: rgba($dark, 0.8);
        padding: $padding 0;

        time{
            color: white;
            font-size: 1rem;
        }
    }
}

.post-container{
    $gap: $padding * 2;

    --full: minmax(#{$gap}, 1fr);
    --popout: minmax(0, #{$vspace - $gap});
    --content: min(calc(#{$container-width} - #{$gap * 2}), calc(#{$max-container-width} - #{$gap * 2}));

    display: grid;
    gap: $gap;
    grid-template-columns:
        [full-start]
            var(--full)
                [popout-start]
                    var(--popout)
                        [content-start]
                            var(--content)
                        [content-end]
                    var(--popout)
                [popout-end]
            var(--full)
        [full-end];

    @media (max-width: $mobile-breakpoint) {
        display: flex;
        flex-direction: column;
        padding-left: $padding * 2;
        padding-right: $padding * 2;
    }

    > :deep(*){
        grid-column: content;
    }

    > :deep(.grid),
    > :deep(.popout){
        grid-column: popout;
    }

    > :deep(.full){
        grid-column: full;
    }
}
</style>
