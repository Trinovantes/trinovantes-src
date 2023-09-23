<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useLiveMeta } from '@/web/client/utils/useLiveMeta'
import { formatDate, formatDateDisplay } from '@/common/utils/formatDate'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String as PropType<string | undefined>,
        default: undefined,
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number as PropType<number | null>,
        default: null,
    },
})

useLiveMeta({
    title: props.title,
    image: props.image,
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

    if (typeof props.updatedAt === 'number') {
        dateInfos.push({
            date: formatDate(props.updatedAt),
            label: `Updated on ${formatDateDisplay(props.updatedAt)}`,
        })
    }

    return dateInfos
})
</script>

<template>
    <article class="blog-post">
        <div
            class="hero-unit"
            :style="{
                'background-image': image ? `url('${image}')` : undefined
            }"
        >
            <div class="title">
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

        <div class="post-container content">
            <slot />
        </div>
    </article>
</template>

<style lang="scss" scoped>
.hero-unit{
    background-color: lighten($dark, 10%);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    .title{
        padding: $vspace 0;

        h1{
            color: white;
            text-shadow: 0 math.div($padding, 8) math.div($padding, 4) rgba($dark, 0.8);

            background: rgba($dark, 0.6);
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
    &.content{
        padding-top: $vspace;
        padding-bottom: $vspace;
    }

    $gap: $padding * 2;
    $gap-left-right: $gap * 2;

    --full: minmax(#{$gap}, 1fr);
    --popout: minmax(0, #{$vspace - $gap});
    --content: min(80ch, calc(#{$container-width} - #{$gap-left-right}), calc(#{$max-container-width} - #{$gap-left-right}));

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
