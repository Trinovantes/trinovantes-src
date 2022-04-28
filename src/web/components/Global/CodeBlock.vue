<script lang="ts" setup>
import { ref, computed, defineProps, watch } from 'vue'
import hljs from 'highlight.js'
import { getIconSvgRaw } from '@/web/utils/ResponsiveLoader'
import { sleep } from '@/common/utils/sleep'

const props = defineProps({
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: '',
    },
    autoDetect: {
        type: Boolean,
        default: true,
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

const code = computed(() => props.code)
const ignoreIllegals = computed(() => props.ignoreIllegals)

const language = ref(props.language)
watch(() => props.language, (newLanguage) => {
    language.value = newLanguage
})

const autoDetect = computed(() => !language.value && props.autoDetect)
const cannotDetectLanguage = computed(() => !autoDetect.value && !hljs.getLanguage(language.value))

const highlightedCode = ref<string>()
watch([cannotDetectLanguage, autoDetect, code, ignoreIllegals], () => {
    // No idea what language to use, return raw code
    if (cannotDetectLanguage.value) {
        console.warn(`The language "${language.value}" you specified could not be found.`)
        highlightedCode.value = escapeHtml(code.value)
    } else if (autoDetect.value) {
        const result = hljs.highlightAuto(code.value)
        language.value = result.language ?? ''
        highlightedCode.value = result.value
    } else {
        const result = hljs.highlight(code.value, {
            language: language.value,
            ignoreIllegals: ignoreIllegals.value,
        })
        highlightedCode.value = result.value
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
    await navigator.clipboard.writeText(code.value)

    // Update icon temporarily
    showCheckmark.value = true
    await sleep(3000)
    showCheckmark.value = false
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
}

const className = computed((): string => {
    let cssClass = ''

    if (!cannotDetectLanguage.value) {
        cssClass += 'hljs'
    }

    if (language.value) {
        cssClass += ' ' + language.value
    }

    return cssClass
})
</script>

<template>
    <div class="code-block">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <button title="Copy code to clipboard" @click="copyToClipboard" v-html="copyIcon" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <pre :class="className" :style="`white-space: ${props.preWhiteSpace};`"><code v-html="highlightedCode" /></pre>
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
