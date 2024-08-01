<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { sleep } from '@/common/utils/sleep'

const props = withDefaults(defineProps<{
    code: string
    language?: string
    popout?: boolean
}>(), {
    language: 'txt',
    popout: false,
})

const highlightedCode = ref<string>()
watch(() => props, async() => {
    const { codeToHtml } = await import('shiki')
    highlightedCode.value = await codeToHtml(props.code, {
        lang: props.language,
        theme: 'github-light',
    })
}, {
    immediate: true,
    deep: true,
})

const clipboardEnabled = ref(false)
onMounted(() => {
    clipboardEnabled.value = 'clipboard' in navigator
})

const showCheckmark = ref(false)
async function copyToClipboard() {
    await navigator.clipboard.writeText(props.code)

    // Update icon temporarily
    showCheckmark.value = true
    await sleep(3000)
    showCheckmark.value = false
}
</script>

<template>
    <div
        :class="{
            'code-block': true,
            popout,
        }"
    >
        <button
            v-if="clipboardEnabled"
            title="Copy code to clipboard"
            @click="copyToClipboard"
        >
            <SvgIcon
                v-if="showCheckmark"
                name="done"
            />
            <SvgIcon
                v-else
                name="copy"
            />
        </button>

        <div v-html="highlightedCode" />
    </div>
</template>

<style lang="scss" scoped>
.code-block{
    $btn-size: 24px;
    $btn-total-size: $btn-size + $padding;
    $pre-padding: $padding * 2;
    $btn-offset: math.div(($pre-padding + $btn-size + $pre-padding) - ($btn-total-size), 2);

    border: 1px solid $dark;
    overflow: hidden;
    position: relative;

    button{
        border: 1px solid $dark;
        border-radius: math.div($padding, 4);
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        width: $btn-total-size; height: $btn-total-size;

        position: absolute;
        top: $btn-offset; right: $btn-offset;

        cursor: pointer;
        opacity: 0;
        transition: $transition;

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

    :deep(pre.shiki){
        background: $light-bg !important;
        line-height: $btn-size;
        overflow: auto;
        padding: $padding * 2;
        width: 100%;

        code{
            background: unset;
            border-radius: unset;
            padding: 0;
        }
    }
}
</style>
