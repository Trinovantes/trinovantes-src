<script lang="ts" setup>
import { computed, h, useSlots } from 'vue'
import { useRoute } from 'vue-router'
import { slugify } from '@/common/utils/slugify'
import { getIconSvgRaw } from '@/web/client/utils/ResponsiveLoaderAsset'

const slots = useSlots()
const props = defineProps({
    size: {
        type: Number,
        default: 2,
    },
    disableLink: {
        type: Boolean,
        default: false,
    },
})

const route = useRoute()
const enableLink = computed(() => !props.disableLink && props.size <= 3) // h3 or lower
const render = () => {
    const childNodes = slots.default?.()
    const slug = (() => {
        let text = ''
        for (const node of childNodes ?? []) {
            if (typeof node.children !== 'string') {
                continue
            }

            text += node.children
        }

        if (text.length === 0) {
            throw new Error('Failed to compute slug for TextHeading')
        }

        return slugify(text)
    })()

    return h(
        `h${props.size}`,
        {
            id: slug,
            class: 'linked-heading',
        },
        [
            enableLink.value && h(
                'a',
                {
                    href: `${route.path}#${slug}`,
                    title: 'Link to this section',
                },
                [
                    childNodes,
                    h(
                        'div',
                        {
                            class: 'svg',
                            innerHTML: getIconSvgRaw('link'),
                        },
                    ),
                ],
            ),
        ],
    )
}
</script>

<template>
    <render />
</template>

<style lang="scss" scoped>
.linked-heading{
    :deep(a) {
        color: $dark;
        text-decoration: none;

        display: flex;
        gap: math.div($padding, 2);

        .svg{
            display: flex;
            align-items: center;
            opacity: 0;
            transition: 0.5s;
        }

        &:hover{
            .svg{
                opacity: 1;
            }
        }
    }
}
</style>
