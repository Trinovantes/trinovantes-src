<script lang="ts" setup>
import 'katex/dist/katex.css'
import { ref, watch } from 'vue'

const props = defineProps<{
    tex: string
}>()

const renderedStr = ref<string>()
watch(() => props, async () => {
    const katex = await import('katex')
    renderedStr.value = katex.default.renderToString(props.tex, {
        throwOnError: true,
        displayMode: false,
    })
}, {
    immediate: true,
})
</script>

<template>
    <span
        class="math-inline"
        v-html="renderedStr"
    />
</template>
