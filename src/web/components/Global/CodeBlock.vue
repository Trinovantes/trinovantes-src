<script lang="ts" setup>
import { ref, computed, defineProps, watch } from 'vue'
import { getIconSvgRaw } from '@/web/utils/ResponsiveLoader'
import { sleep } from '@/common/utils/sleep'
import hljs from 'highlight.js/lib/core'
import type { LanguageFn } from 'highlight.js'
import { escapeHtml } from '@vue/shared'

const props = defineProps({
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: 'txt',
    },
    ignoreIllegals: {
        type: Boolean,
        default: true,
    },
    preWhiteSpace: {
        type: String,
        default: 'pre',
    },
})

const languageMap = new Map<string, string>([
    ['js', 'javascript'],
    ['ts', 'typescript'],
    ['html', 'xml'],
])

const highlightedCode = ref<string>()
watch(() => props, async() => {
    if (props.language === 'txt') {
        highlightedCode.value = escapeHtml(props.code)
    } else {
        if (!hljs.getLanguage(props.language)) {
            const fileName = languageMap.get(props.language) ?? props.language
            const { default: languageFn } = await import(`highlight.js/lib/languages/${fileName}`) as { default: LanguageFn }
            hljs.registerLanguage(props.language, languageFn)
        }

        highlightedCode.value = hljs.highlight(props.code, {
            language: props.language,
            ignoreIllegals: props.ignoreIllegals,
        }).value
    }
}, {
    immediate: true,
})

const showCheckmark = ref(false)
const copyIcon = computed<string>(() => {
    if (showCheckmark.value) {
        return getIconSvgRaw('done')
    } else {
        return getIconSvgRaw('copy')
    }
})

async function copyToClipboard() {
    await navigator.clipboard.writeText(props.code)

    // Update icon temporarily
    showCheckmark.value = true
    await sleep(3000)
    showCheckmark.value = false
}
</script>

<template>
    <div class="code-block">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <button title="Copy code to clipboard" @click="copyToClipboard" v-html="copyIcon" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <pre :class="`hljs ${language}`" :style="`white-space: ${props.preWhiteSpace};`"><code v-html="highlightedCode" /></pre>
    </div>
</template>

<style lang="scss" scoped>
.code-block{
    position: relative;

    button{
        $size: $padding * 3;

        border: 1px solid #aaa;
        border-radius: math.div($padding, 2);
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        width: $size; height: $size;

        position: absolute;
        top: $padding; right: $padding;

        cursor: pointer;
        opacity: 0;
        transition: 1s;

        &:hover{
            background: #ccc;
        }

        svg{
            width: math.div($size, 2);
            height: math.div($size, 2);
        }
    }

    &:hover{
        button{
            opacity: 1;
        }
    }

    pre.hljs{
        line-height: 1.25;

        code{
            background: unset;
            border-radius: unset;
            padding: 0;
        }
    }
}
</style>
