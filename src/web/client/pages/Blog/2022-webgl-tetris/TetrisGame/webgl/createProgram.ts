export function createProgram(gl: WebGL2RenderingContext, shaders: Array<WebGLShader>): WebGLProgram {
    const program = gl.createProgram()
    if (program === null) {
        throw new Error('Failed to create program')
    }

    for (const shader of shaders) {
        gl.attachShader(program, shader)
    }

    gl.linkProgram(program)

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean
    if (!linkStatus) {
        throw new Error('Failed to link program')
    }

    return program
}
