import { vec3 } from 'gl-matrix'
import { defaultTetriminoePoints } from './Tetriminoe.ts'

export type Material = {
    ia: vec3 // ambiant intensity
    id: vec3 // diffuse intensity
    is: vec3 // specular intensity
    ka: number // material ka
    kd: number // material kd
    ks: number // material ks
    shininess: number
}

export const gridMaterial: Material = {
    ia: vec3.fromValues(0.3, 0.3, 0.3),
    id: vec3.fromValues(1.0, 1.0, 1.0),
    is: vec3.fromValues(1.0, 1.0, 1.0),
    ka: 1,
    kd: 0,
    ks: 0,
    shininess: 0,
}

export const gridHighlightMaterial: Material = {
    ia: vec3.fromValues(0.5, 0.0, 0.0),
    id: vec3.fromValues(1.0, 1.0, 1.0),
    is: vec3.fromValues(1.0, 1.0, 1.0),
    ka: 1,
    kd: 0,
    ks: 0,
    shininess: 0,
}

export const blockMaterials = createRandomMaterials(defaultTetriminoePoints.length)

function createRandomMaterials(n: number): Array<Material> {
    const materials = new Array<Material>()

    for (let i = 0; i < n; i++) {
        const hex = Math.floor(Math.random() * 0xFFFFFF)
        const r = (hex & 0xFF0000) >> 16
        const g = (hex & 0x00FF00) >> 8
        const b = (hex & 0x0000FF) >> 0

        materials.push({
            ia: vec3.fromValues(r / 255 + 0.1, g / 255 + 0.1, b / 255 + 0.1),
            id: vec3.fromValues(r / 255 + 0.1, g / 255 + 0.1, b / 255 + 0.1),
            is: vec3.fromValues(r / 255 + 0.1, g / 255 + 0.2, b / 255 + 0.1),
            ka: 0.5,
            kd: 0.5,
            ks: 0.5,
            shininess: 20,
        })
    }

    return materials
}
