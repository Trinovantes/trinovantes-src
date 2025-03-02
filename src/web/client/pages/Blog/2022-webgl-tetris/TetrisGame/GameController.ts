import { mat4, vec3 } from 'gl-matrix'
import { GameState } from './state/GameState'
import { gridHighlightMaterial, gridMaterial, Material } from './state/Material'
import { createVertexBuffer, FLOAT_SIZE } from './webgl/createBuffer'
import { createProgram } from './webgl/createProgram'
import { createFragmentShader, createVertexShader } from './webgl/createShader'

const ALL_UNIFORMS = [
    // Vertex Shader
    'modelMatrix',
    'modelNormalMatrix',
    'mvpMatrix',

    // Fragment Shader
    'cameraPos_worldspace',
    'lightPos_worldspace',

    'material.ia',
    'material.id',
    'material.is',
    'material.ka',
    'material.kd',
    'material.ks',
    'material.shininess',
] as const

type Uniform = typeof ALL_UNIFORMS[number]

const GAME_SPEED_MS = 500
const FONT_SIZE = 20
const NUM_ROWS = 20
const NUM_COLS = 8

export class GameController {
    #isDestroyed: boolean
    #gameState: GameState

    #isFocused = false
    #idleTransform = mat4.create()

    #container: HTMLElement | null
    #glCanvas: HTMLCanvasElement | null
    #uiCanvas: HTMLCanvasElement | null

    #glProgram: WebGLProgram | null = null
    #glVertexBuffer: WebGLBuffer | null = null

    #vertexLocation: number = NaN
    #normalLocation: number = NaN
    #uniforms = new Map<Uniform, WebGLUniformLocation | null>()

    constructor(container: HTMLElement, glCanvas: HTMLCanvasElement, uiCanvas: HTMLCanvasElement) {
        this.#isDestroyed = false
        this.#gameState = new GameState(NUM_ROWS, NUM_COLS)

        this.#container = container
        this.#glCanvas = glCanvas
        this.#uiCanvas = uiCanvas
        this.resizeCanvas()
    }

    destroy() {
        console.info('GameController', 'destroy')
        this.#isDestroyed = true

        this.#container = null
        this.#glCanvas = null
        this.#uiCanvas = null

        this.#glProgram = null
        this.#glVertexBuffer = null

        this.#vertexLocation = NaN
        this.#normalLocation = NaN
        this.#uniforms.clear()
    }

    resizeCanvas() {
        const w = this.#container?.offsetWidth ?? 0
        const h = this.#container?.offsetHeight ?? 0

        if (w < 1 || h < 1) {
            return
        }

        const resize = (canvas: HTMLCanvasElement | null) => {
            if (!canvas) {
                throw new Error('Invalid canvas')
            }

            if (canvas.width !== w) {
                canvas.width = w
            }

            if (canvas.height !== h) {
                canvas.height = h
            }
        }

        resize(this.#glCanvas)
        resize(this.#uiCanvas)
    }

    onKeyPress(event: KeyboardEvent) {
        if (!this.#gameState.isGameActive) {
            this.#gameState.reset()
            return
        }

        switch (event.key) {
            case 's': {
                this.#gameState.moveDown()
                break
            }
            case 'a': {
                this.#gameState.moveLeft()
                break
            }
            case 'd': {
                this.#gameState.moveRight()
                break
            }
            case 'j': {
                this.#gameState.rotateCcw()
                break
            }
            case 'k': {
                this.#gameState.rotateCw()
                break
            }
        }
    }

    onFocusIn() {
        this.#isFocused = true
        mat4.identity(this.#idleTransform)
    }

    onFocusOut() {
        this.#isFocused = false
        mat4.identity(this.#idleTransform)
    }

    get startMsg() {
        return this.#isFocused
            ? '(press any key to start)'
            : '(click to focus)'
    }

    async initCanvas() {
        const ctx = this.#uiCanvas?.getContext('2d')
        if (!ctx) {
            throw new Error('Failed to get Context2D for uiCanvas')
        }
        const gl = this.#glCanvas?.getContext('webgl2')
        if (!gl) {
            throw new Error('Failed to get WebGL for glCanvas')
        }

        console.info('GameController', 'initCanvas', gl.getParameter(gl.VENDOR), gl.getParameter(gl.VERSION), gl.getParameter(gl.SHADING_LANGUAGE_VERSION))

        const vertShader = await createVertexShader(gl)
        const fragShader = await createFragmentShader(gl)

        this.#glProgram = createProgram(gl, [vertShader, fragShader])
        this.#glVertexBuffer = createVertexBuffer(gl)

        this.#vertexLocation = gl.getAttribLocation(this.#glProgram, 'vertex_modelspace')
        this.#normalLocation = gl.getAttribLocation(this.#glProgram, 'normal_modelspace')

        for (const uniformName of ALL_UNIFORMS) {
            const uniformLocation = gl.getUniformLocation(this.#glProgram, uniformName)
            this.#uniforms.set(uniformName, uniformLocation)
        }

        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
        gl.frontFace(gl.CCW)
    }

    run() {
        let prevTimestampMs = 0
        let prevUpdateMs = 0

        const gameLoop = (timestampMs: number) => {
            if (this.#isDestroyed) {
                return
            }

            const elapsedMs = timestampMs - prevTimestampMs
            prevTimestampMs = timestampMs
            prevUpdateMs += elapsedMs

            while (prevUpdateMs > GAME_SPEED_MS) {
                if (this.#isFocused) {
                    this.#gameState.nextTick()
                }
                prevUpdateMs -= GAME_SPEED_MS
            }

            const fps = 1000 / elapsedMs
            this.#drawUi(fps)
            this.#drawGameState()

            requestAnimationFrame(gameLoop)
        }

        requestAnimationFrame(gameLoop)
    }

    #drawUi(fps: number) {
        const ctx = this.#uiCanvas?.getContext('2d')
        if (!ctx) {
            throw new Error('Failed to get Context2D for uiCanvas')
        }

        ctx.textBaseline = 'middle'
        ctx.shadowColor = '#000'

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.font = `${FONT_SIZE}px monospace`
        ctx.fillStyle = '#ccc'
        ctx.textAlign = 'left'
        ctx.shadowBlur = 0
        ctx.fillText(`FPS:   ${fps.toFixed(1)}`, 10, 10 + (FONT_SIZE / 2))
        ctx.fillText(`Score: ${this.#gameState.score}`, 10, 10 + (FONT_SIZE / 2) + FONT_SIZE)

        ctx.fillText('Move Left    [w]', 10, 10 + (FONT_SIZE / 2) + (FONT_SIZE * 3))
        ctx.fillText('Move Right   [D]', 10, 10 + (FONT_SIZE / 2) + (FONT_SIZE * 4))
        ctx.fillText('Drop         [S]', 10, 10 + (FONT_SIZE / 2) + (FONT_SIZE * 5))
        ctx.fillText('Rotate Left  [J]', 10, 10 + (FONT_SIZE / 2) + (FONT_SIZE * 7))
        ctx.fillText('Rotate Right [K]', 10, 10 + (FONT_SIZE / 2) + (FONT_SIZE * 8))

        if (!this.#gameState.isGameActive || !this.#isFocused) {
            ctx.font = `${FONT_SIZE * 1.5}px monospace`
            ctx.fillStyle = '#fff'
            ctx.textAlign = 'center'
            ctx.shadowBlur = 10
            ctx.fillText(this.startMsg, ctx.canvas.width / 2, ctx.canvas.height / 2)
        }
    }

    #drawGameState() {
        const gl = this.#glCanvas?.getContext('webgl2')
        if (!gl) {
            throw new Error('Failed to get WebGL for glCanvas')
        }
        if (!this.#glProgram) {
            throw new Error('Invalid glProgram')
        }

        // Use compiled shaders
        gl.useProgram(this.#glProgram)

        // Define clip space
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // Clear canvas
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        this.#updateIdleTransform()
        this.#setCamera(gl)
        this.#setLight(gl)

        for (let x = 0; x < NUM_COLS; x++) {
            for (let y = 0; y < NUM_ROWS; y++) {
                const cubeTransform = mat4.create()
                if (!this.#isFocused) {
                    mat4.multiply(cubeTransform, cubeTransform, this.#idleTransform)
                }
                mat4.translate(cubeTransform, cubeTransform, vec3.fromValues(x, y, 0))
                this.#setModelMatrixUniforms(gl, cubeTransform)

                const material = this.#gameState.getBoardAt(x, y) ??
                    (this.#gameState.isInActivePieceCol(x)
                        ? gridHighlightMaterial
                        : gridMaterial)
                this.#setMaterial(gl, material)

                const triangleMode = this.#gameState.getBoardAt(x, y)
                    ? gl.TRIANGLES
                    : gl.LINE_STRIP

                this.#drawCube(gl, cubeTransform, triangleMode)
            }
        }
    }

    #drawCube(gl: WebGL2RenderingContext, cubeTransform: mat4, triangleMode: number) {
        // Send input from vertex buffer
        const numComponents = 3
        const partsPerVertex = 2
        const normalize = false
        const stride = numComponents * partsPerVertex * FLOAT_SIZE
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glVertexBuffer)
        gl.vertexAttribPointer(this.#vertexLocation, numComponents, gl.FLOAT, normalize, stride, 0 * FLOAT_SIZE)
        gl.vertexAttribPointer(this.#normalLocation, numComponents, gl.FLOAT, normalize, stride, 3 * FLOAT_SIZE)
        gl.enableVertexAttribArray(this.#vertexLocation)
        gl.enableVertexAttribArray(this.#normalLocation)

        // Finally draw the cube
        gl.drawArrays(triangleMode, 0, 6 * numComponents * partsPerVertex)
    }

    #setCamera(gl: WebGL2RenderingContext) {
        const { position } = this.camera
        const uniform = this.#uniforms.get('cameraPos_worldspace') ?? null
        gl.uniform3fv(uniform, position)
    }

    #setLight(gl: WebGL2RenderingContext) {
        const lightPosition = this.light
        const uniform = this.#uniforms.get('lightPos_worldspace') ?? null
        gl.uniform3fv(uniform, lightPosition)
    }

    #setModelMatrixUniforms(gl: WebGL2RenderingContext, modelMatrix: mat4) {
        {
            const uniform = this.#uniforms.get('modelMatrix') ?? null
            gl.uniformMatrix4fv(uniform, false, modelMatrix)
        }
        {
            const modelNormalMatrix = mat4.clone(modelMatrix)
            mat4.invert(modelNormalMatrix, modelNormalMatrix)
            mat4.transpose(modelNormalMatrix, modelNormalMatrix)

            const uniform = this.#uniforms.get('modelNormalMatrix') ?? null
            gl.uniformMatrix4fv(uniform, false, modelNormalMatrix)
        }
        {
            const mvpMatrix = mat4.create()
            mat4.multiply(mvpMatrix, mvpMatrix, this.perspectiveMatrix)
            mat4.multiply(mvpMatrix, mvpMatrix, this.cameraMatrix)
            mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix)

            const uniform = this.#uniforms.get('mvpMatrix') ?? null
            gl.uniformMatrix4fv(uniform, false, mvpMatrix)
        }
    }

    #setMaterial(gl: WebGL2RenderingContext, material: Material) {
        const iaUniform = this.#uniforms.get('material.ia') ?? null
        gl.uniform3fv(iaUniform, material.ia)

        const idUniform = this.#uniforms.get('material.id') ?? null
        gl.uniform3fv(idUniform, material.id)

        const isUniform = this.#uniforms.get('material.is') ?? null
        gl.uniform3fv(isUniform, material.is)

        const kaUniform = this.#uniforms.get('material.ka') ?? null
        gl.uniform1f(kaUniform, material.ka)

        const kdUniform = this.#uniforms.get('material.kd') ?? null
        gl.uniform1f(kdUniform, material.kd)

        const ksUniform = this.#uniforms.get('material.ks') ?? null
        gl.uniform1f(ksUniform, material.ks)

        const shininessUniform = this.#uniforms.get('material.shininess') ?? null
        gl.uniform1f(shininessUniform, material.shininess)
    }

    #updateIdleTransform() {
        const x = (NUM_COLS / 2)
        const y = (NUM_ROWS / 2)

        mat4.translate(this.#idleTransform, this.#idleTransform, vec3.fromValues(x, y, 0))
        mat4.rotate(this.#idleTransform, this.#idleTransform, 0.5 * Math.PI / 180, vec3.fromValues(0, 1, 0))
        mat4.translate(this.#idleTransform, this.#idleTransform, vec3.fromValues(-x, -y, 0))
    }

    get perspectiveMatrix(): mat4 {
        const fieldOfView = 60 * (Math.PI / 180)
        const aspect = (this.#glCanvas?.width ?? 1) / (this.#glCanvas?.height ?? 1)
        const zNear = 0.001
        const zFar = 100.0

        const perspectiveMatrix = mat4.create()
        mat4.perspective(perspectiveMatrix, fieldOfView, aspect, zNear, zFar)

        return perspectiveMatrix
    }

    get cameraMatrix(): mat4 {
        const { position, target } = this.camera
        const up = vec3.fromValues(0, 1, 0)

        const cameraMatrix = mat4.create()
        mat4.lookAt(cameraMatrix, position, target, up)

        return cameraMatrix
    }

    get camera(): { position: vec3; target: vec3 } {
        const x = (NUM_COLS / 2)
        const y = (NUM_ROWS / 2)

        const position = vec3.fromValues(x, y, 20)
        const target = vec3.fromValues(x, y, 0)

        return { position, target }
    }

    get light(): vec3 {
        const x = (NUM_COLS / 2)
        const y = (NUM_ROWS / 2)

        return vec3.fromValues(x, y, 20)
    }
}
