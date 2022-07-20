<script lang="ts" setup>
import hljs from 'highlight.js/lib/core'
import { ref, computed, watch, onMounted } from 'vue'
import { sleep } from '@/common/utils/sleep'
import { getIconSvgRaw } from '@/web/utils/ResponsiveImage'
import { escapeHtml } from '@/web/utils/escapeHtml'
import type { LanguageFn } from 'highlight.js'

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

const clipboardEnabled = ref(false)
onMounted(() => {
    clipboardEnabled.value = 'clipboard' in navigator
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
        <button v-if="clipboardEnabled" title="Copy code to clipboard" @click="copyToClipboard" v-html="copyIcon" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <pre :class="`hljs ${language}`" :style="`white-space: ${props.preWhiteSpace};`"><code v-html="highlightedCode" /></pre>
    </div>
</template>

<style lang="scss" scoped>
.code-block{
    $btn-size: 24px;
    $btn-total-size: $btn-size + $padding;
    $pre-padding: $padding * 2;
    $btn-offset: math.div(($pre-padding + $btn-size + $pre-padding) - ($btn-total-size), 2);

    position: relative;

    button{
        border: 1px solid #aaa;
        border-radius: math.div($padding, 2);
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        width: $btn-total-size; height: $btn-total-size;

        position: absolute;
        top: $btn-offset; right: $btn-offset;

        cursor: pointer;
        opacity: 0;
        transition: 1s;

        &:hover{
            background: #ccc;
        }

        svg{
            width: $btn-size;
            height: $btn-size;
        }
    }

    &:hover{
        button{
            opacity: 1;
        }
    }

    pre.hljs{
        line-height: $btn-size;

        code{
            background: unset;
            border-radius: unset;
            padding: 0;
        }
    }
}
</style>
