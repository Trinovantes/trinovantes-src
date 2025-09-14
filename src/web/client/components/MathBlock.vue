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
        displayMode: true,
    })
}, {
    immediate: true,
})
</script>

<template>
    <div
        class="math-block"
        v-html="renderedStr"
    />
</template>

<style lang="scss" scoped>
.math-block{
    border: 1px solid $dark;
    overflow-x: auto;
    padding: ($padding * 2) 0;

    :deep(.katex-display){
        margin: 0;
    }
}
</style>
