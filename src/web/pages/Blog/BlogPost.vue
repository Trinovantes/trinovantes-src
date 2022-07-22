<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useMeta } from 'vue-meta'
import { formatDate, formatDateDisplay } from '@/common/utils/formatDate'
import { createPageHeadOptions } from '@/web/utils/createPageHeadOptions'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String as PropType<string | null>,
        default: null,
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number as PropType<number | null>,
        default: null,
    },
    withSidebar: {
        type: Boolean,
        default: false,
    },
})

useMeta(computed(() => {
    return createPageHeadOptions({
        title: props.title,
        image: props.image,
    })
}))

interface DateInfo {
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
            <div class="container text-container">
                <h1>
                    {{ title }}
                </h1>
            </div>

            <div class="meta">
                <div class="container text-container">
                    <time
                        v-for="dateInfo of dateInfos"
                        :key="dateInfo.date"
                        :datetime="dateInfo.date"
                    >
                        {{ dateInfo.label }}
                    </time>
                </div>
            </div>
        </div>

        <div
            :class="{
                'container': true,
                'text-container': true,
                'with-sidebar': withSidebar,
            }"
        >
            <slot />
        </div>
    </article>
</template>

<style lang="scss" scoped>
$blog-width: 80ch;

.hero-unit{
    background-color: lighten($dark, 10%);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    h1{
        color: white;
        text-shadow: 0 math.div($padding, 8) math.div($padding, 4) rgba($dark, 0.8);

        background: rgba($dark, 0.6);
        margin: 0 -($padding * 2);
        padding: $padding * 2;
    }

    .meta{
        background: rgba($dark, 0.8);
        display: flex;
        gap: $padding;
        padding: $padding 0;

        .container{
            display: flex;
            gap: $padding * 2;
            padding-top: 0;
            padding-bottom: 0;

            @media (max-width: $mobile-breakpoint) {
                flex-direction: column;
                gap: math.div($padding, 2);
            }

            time{
                color: white;
                font-size: 1rem;
            }
        }
    }
}

.text-container:not(.with-sidebar){
    gap: $padding * 2;
    max-width: $blog-width;
}
</style>
