import { vec3 } from 'gl-matrix'

const cubeVertPos = [
    0.0, 0.0, 0.0, // 0
    1.0, 0.0, 0.0, // 1
    1.0, 0.0, 1.0, // 2
    0.0, 0.0, 1.0, // 3

    0.0, 1.0, 0.0, // 4
    1.0, 1.0, 0.0, // 5
    1.0, 1.0, 1.0, // 6
    0.0, 1.0, 1.0, // 7
]

const cubeVertIdx = [
    0, 3, 7, // Left
    0, 7, 4,
    1, 6, 2, // Right
    1, 5, 6,

    0, 5, 1, // Back
    0, 4, 5,
    2, 6, 7, // Front
    2, 7, 3,

    0, 1, 2, // Bottom
    0, 2, 3,
    6, 5, 4, // Top
    6, 4, 7,
]

export const FLOAT_SIZE = 4 // 32-bits

export function createBuffer(gl: WebGL2RenderingContext, bufferData: BufferSource): WebGLBuffer {
    const vertPositionBuffer = gl.createBuffer()
    if (!vertPositionBuffer) {
        throw new Error('Failed to create buffer')
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)

    const bufferSize = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) as number
    if (bufferSize !== bufferData.byteLength) {
        throw new Error('Failed to bind buffer')
    }

    return vertPositionBuffer
}

export function createVertexBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
    const vertexData = new Array<number>()

    for (let i = 0; i < cubeVertIdx.length; i += 3) {
        const p0Idx = cubeVertIdx[i + 0]
        const p1Idx = cubeVertIdx[i + 1]
        const p2Idx = cubeVertIdx[i + 2]

        const p0 = vec3.fromValues(cubeVertPos[p0Idx * 3 + 0], cubeVertPos[p0Idx * 3 + 1], cubeVertPos[p0Idx * 3 + 2])
        const p1 = vec3.fromValues(cubeVertPos[p1Idx * 3 + 0], cubeVertPos[p1Idx * 3 + 1], cubeVertPos[p1Idx * 3 + 2])
        const p2 = vec3.fromValues(cubeVertPos[p2Idx * 3 + 0], cubeVertPos[p2Idx * 3 + 1], cubeVertPos[p2Idx * 3 + 2])

        const v1 = vec3.subtract(vec3.create(), p1, p0)
        const v2 = vec3.subtract(vec3.create(), p2, p0)
        const n = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), v1, v2))

        vertexData.push(p0[0], p0[1], p0[2], n[0], n[1], n[2])
        vertexData.push(p1[0], p1[1], p1[2], n[0], n[1], n[2])
        vertexData.push(p2[0], p2[1], p2[2], n[0], n[1], n[2])
    }

    return createBuffer(gl, new Float32Array(vertexData))
}
