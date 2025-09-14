<script lang="ts" setup>
import { computed, h, type VNode } from 'vue'
import { useRoute } from 'vue-router'
import { slugify } from '../../../common/utils/slugify.ts'
import { getIconSvgRaw } from '../utils/ResponsiveLoaderAsset.ts'

const slots = defineSlots<{
    default: () => Array<VNode>
}>()

const props = withDefaults(defineProps<{
    size?: number
    disableLink?: boolean
}>(), {
    size: 2,
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
        text-decoration: none;
        color: $dark;
        position: relative;

        .svg{
            display: flex;
            align-items: center;
            opacity: 0;
            transition: $transition;

            width: 24px;
            height: 24px;
            position: absolute;
            bottom: calc(-12px + 0.5lh); // Relative to bottom, shift down half of svg 12px (to center icon) then up half lineheight (to center last line)
            right: -24px - math.div($padding, 2);
        }

        &:hover{
            .svg{
                opacity: 1;
            }
        }
    }
}
</style>
