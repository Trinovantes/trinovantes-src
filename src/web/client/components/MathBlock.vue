<script lang="ts" setup>
import 'katex/dist/katex.css'
import katex from 'katex'
import { ref, watch } from 'vue'

const props = defineProps<{
    tex: string
}>()

const renderedStr = ref<string>()
watch(() => props, () => {
    renderedStr.value = katex.renderToString(props.tex, {
        throwOnError: true,
        displayMode: true,
    })
}, {
    immediate: true,
})
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="math-block" v-html="renderedStr" />
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
