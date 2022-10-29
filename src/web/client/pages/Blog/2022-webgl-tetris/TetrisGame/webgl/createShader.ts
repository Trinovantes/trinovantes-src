export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)
    if (!shader) {
        throw new Error(`Failed to create shader:\n\n${gl.getError()}`)
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean
    if (!compileStatus) {
        throw new Error(`Failed to compile shader:\n\n${gl.getShaderInfoLog(shader)}`)
    }

    return shader
}

export async function createVertexShader(gl: WebGL2RenderingContext): Promise<WebGLShader> {
    const { default: source } = await import('./shader.vert')
    return createShader(gl, gl.VERTEX_SHADER, source)
}

export async function createFragmentShader(gl: WebGL2RenderingContext): Promise<WebGLShader> {
    const { default: source } = await import('./shader.frag')
    return createShader(gl, gl.FRAGMENT_SHADER, source)
}
