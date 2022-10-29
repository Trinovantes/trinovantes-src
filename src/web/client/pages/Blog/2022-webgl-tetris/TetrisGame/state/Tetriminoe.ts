type Points = ReadonlyArray<Readonly<[number, number]>>

export class Tetriminoe {
    readonly #points: Points

    #rotationDeg = 0

    constructor(points: Points) {
        this.#points = points
    }

    get width() {
        const x = this.rotatedPoints.map((p) => p[0])
        return Math.max(...x) - Math.min(...x) + 1
    }

    get height() {
        const y = this.rotatedPoints.map((p) => p[1])
        return Math.max(...y) - Math.min(...y) + 1
    }

    get leftMargin() {
        const xLeftOrigin = this.rotatedPoints.map((p) => p[0]).filter((x) => x < 0)
        if (xLeftOrigin.length === 0) {
            return 0
        }

        return Math.abs(Math.min(...xLeftOrigin))
    }

    get bottomMargin() {
        const yBelowOrigin = this.rotatedPoints.map((p) => p[1]).filter((y) => y < 0)
        if (yBelowOrigin.length === 0) {
            return 0
        }

        return Math.abs(Math.min(...yBelowOrigin))
    }

    rotateCw() {
        this.#rotationDeg = (this.#rotationDeg - 90) % 360
    }

    rotateCcw() {
        this.#rotationDeg = (this.#rotationDeg + 90) % 360
    }

    get rotatedPoints(): Points {
        const rotationRads = this.#rotationDeg * (Math.PI / 180)
        const rotatedPoints: Points = this.#points.map(([x, y]) => {
            const newX = Math.round(x * Math.cos(rotationRads) - y * Math.sin(rotationRads))
            const newY = Math.round(x * Math.sin(rotationRads) + y * Math.cos(rotationRads))
            return [newX, newY]
        })

        return rotatedPoints
    }

    debugLog() {
        const map = [
            '.....',
            '.....',
            '.....',
            '.....',
            '.....',
        ]

        for (const point of this.rotatedPoints) {
            const isOrigin = (point[0] === 0 && point[1] === 0)
            const symbol = isOrigin ? 'o' : 'x'

            const x = point[0] + 2
            const y = -point[1] + 2 // cartesian y is (+) up, drawing y is (-) down

            map[y] = map[y].substring(0, x) + symbol + map[y].substring(x + 1)
        }

        console.debug(map.join('\n'))
    }
}

export const defaultTetriminoePoints: ReadonlyArray<Points> = [
    // x
    // o
    // x
    // x
    [
        [0, 1],
        [0, 0],
        [0, -1],
        [0, -2],
    ],

    // ox
    // xx
    [
        [0, 0],
        [0, -1],
        [1, 0],
        [1, -1],
    ],

    // x
    // xo
    //  xx
    [
        [-1, 1],
        [-1, 0],
        [0, 0],
        [0, -1],
        [1, -1],
    ],

    // xox
    //  x
    [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, -1],
    ],

    // x
    // x
    // ox
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
    ],

    //  x
    //  x
    // xo
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [-1, 0],
    ],

    // x
    // ox
    //  x
    [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, -1],
    ],

    //  x
    // xo
    // x
    [
        [0, 0],
        [0, 1],
        [-1, 0],
        [-1, -1],
    ],
]
