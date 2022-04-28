<script lang="ts" setup>
import { formatDate, formatDateDisplay } from '@/common/utils/formatDate'
import { createPageHeadOptions } from '@/web/utils/PageHeadOptions'
import { Dayjs } from 'dayjs'
import { computed, defineProps, PropType } from 'vue'
import { useMeta } from 'vue-meta'

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
        type: Object as PropType<Dayjs>,
        required: true,
    },
    updatedAt: {
        type: Object as PropType<Dayjs | null>,
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

    if (props.updatedAt) {
        dateInfos.push({
            date: formatDate(props.updatedAt),
            label: `Last update on ${formatDateDisplay(props.updatedAt)}`,
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
            <h1 class="container">
                {{ title }}
            </h1>

            <div class="container">
                <section class="meta">
                    <time
                        v-for="dateInfo of dateInfos"
                        :key="dateInfo.date"
                        :datetime="dateInfo.date"
                    >
                        {{ dateInfo.label }}
                    </time>
                </section>
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
.hero-unit{
    background-color: lighten($dark, 10%);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-bottom: math.div($padding, 2) solid lighten($dark, 10%);
    padding: $vspace 0 ($vspace - math.div($padding, 2));

    h1{
        color: white;
        text-shadow: 0 math.div($padding, 8) math.div($padding, 4) rgba($dark, 0.8);
    }
}

.meta{
    display: flex;
    gap: $padding;
    margin-top: $padding * 2;

    time{
        background: rgba($dark, 0.8);
        color: white;
        padding: math.div($padding, 2) $padding;
    }

    @media (max-width: $mobile-breakpoint) {
        flex-direction: column;
    }
}

.text-container:not(.with-sidebar){
    gap: $padding * 2;
}
</style>
