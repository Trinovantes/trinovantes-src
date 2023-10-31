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
        displayMode: false,
    })
}, {
    immediate: true,
})
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span class="math-inline" v-html="renderedStr" />
</template>
