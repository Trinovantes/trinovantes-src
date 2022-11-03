<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { GameController } from './TetrisGame/GameController'

const containerRef = ref<HTMLDivElement | null>(null)
const glCanvasRef = ref<HTMLCanvasElement | null>(null)
const uiCanvasRef = ref<HTMLCanvasElement | null>(null)

let controller: GameController | null = null

const onResize = () => {
    controller?.resizeCanvas()
}

const onKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        containerRef.value?.blur()
        return
    }

    controller?.onKeyPress(event)
}

const onFocusIn = () => {
    controller?.onFocusIn()
}

const onFocusOut = () => {
    controller?.onFocusOut()
}

const errorMsg = ref<string | null>(null)
onMounted(async() => {
    if (!containerRef.value) {
        throw new Error('Cannot find containerRef')
    }
    if (!glCanvasRef.value) {
        throw new Error('Cannot find glCanvasRef')
    }
    if (!uiCanvasRef.value) {
        throw new Error('Cannot find uiCanvasRef')
    }

    try {
        controller = new GameController(containerRef.value, glCanvasRef.value, uiCanvasRef.value)
        await controller.initCanvas()
        controller.run()
    } catch (err) {
        errorMsg.value = String(err)
        console.warn(err)
    }

    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)

    controller?.destroy()
    controller = null
})
</script>

<template>
    <div
        v-if="errorMsg"
        class="error"
    >
        {{ errorMsg }}
    </div>

    <div
        v-else
        ref="containerRef"
        class="stage popout"
        tabindex="0"
        @keyup="onKeyPress"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
    >
        <canvas ref="glCanvasRef" />
        <canvas ref="uiCanvasRef" />
    </div>
</template>

<style lang="scss" scoped>
.error{
    background: $warning;
    padding: $padding ($padding * 2);
    font-weight: bold;
}

.stage{
    position: relative;
    width: 100%;
    height: 80vh;

    canvas{
        background: transparent;
        position: absolute;
        top: 0; left: 0;
    }
}
</style>
