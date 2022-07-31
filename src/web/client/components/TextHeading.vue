<script lang="ts" setup>
import { computed, h, useSlots } from 'vue'
import { useRoute } from 'vue-router'
import { slugify } from '@/common/utils/slugify'
import { getIconSvgRaw } from '@/web/client/utils/ResponsiveImage'

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

        return slugify(text)
    })()

    return h(
        `h${props.size}`,
        {
            id: slug,
            class: 'linked-heading',
        },
        [
            childNodes,
            enableLink.value && h(
                'a',
                {
                    href: `${route.path}#${slug}`,
                    title: 'Link to this section',
                    innerHTML: getIconSvgRaw('link'),
                },
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
    a{
        opacity: 0;
    }

    &:hover{
        a{
            opacity: 1;
        }
    }
}
</style>
