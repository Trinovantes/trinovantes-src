import { blockMaterials, type Material } from './Material.ts'
import { Tetriminoe, defaultTetriminoePoints } from './Tetriminoe.ts'

type BoardCol = Material | null
type BoardRow = Array<BoardCol>
type Board = Array<BoardRow>

type ActivePiece = {
    block: Tetriminoe
    material: Material
    x: number
    y: number
}

export class GameState {
    readonly boardHeight: number
    readonly boardWidth: number

    #isGameActive = false
    #activePiece: ActivePiece | null = null
    #board: Board = []
    #score: number = 0

    constructor(rows: number, cols: number) {
        this.boardHeight = rows
        this.boardWidth = cols
    }

    get isGameActive() {
        return this.#isGameActive
    }

    get score() {
        return this.#score
    }

    getBoardAt(x: number, y: number): Material | null {
        if (y >= this.#board.length) {
            return null
        }
        if (x >= this.#board[y].length) {
            return null
        }

        return this.#board[y][x]
    }

    isInActivePieceCol(x: number): boolean {
        if (!this.#activePiece) {
            return false
        }

        const left = this.#activePiece.x - this.#activePiece.block.leftMargin
        const right = left + this.#activePiece.block.width

        if (x < left) {
            return false
        }

        if (x >= right) {
            return false
        }

        return true
    }

    #resetBoard(): void {
        this.#board = []
        this.#score = 0

        for (let r = 0; r < this.boardHeight; r++) {
            this.#board.push(Array<BoardCol>(this.boardWidth).fill(null))
        }
    }

    #gameOver(): void {
        console.info('GameState', 'gameOver')
        this.#isGameActive = false
        this.#activePiece = null
    }

    reset(): void {
        console.info('GameState', 'reset')
        this.#isGameActive = true

        this.#resetBoard()
        this.#generateActivePiece()
    }

    nextTick(): void {
        if (!this.isGameActive) {
            return
        }
        if (!this.#activePiece) {
            throw new Error('Invalid activePiece')
        }

        this.#setActivePieceOnBoard(true)
        const newX = this.#activePiece.x
        const newY = this.#activePiece.y - 1

        if (this.#activePieceCanFitOnBoard(newX, newY)) {
            this.#activePiece.x = newX
            this.#activePiece.y = newY
            this.#setActivePieceOnBoard()
        } else {
            this.#setActivePieceOnBoard()

            if ((this.#activePiece.y + this.#activePiece.block.bottomMargin) >= this.boardHeight) {
                this.#gameOver()
            } else {
                this.#clearFullRows()
                this.#generateActivePiece()
            }
        }
    }

    moveDown(): void {
        if (!this.isGameActive) {
            return
        }
        if (!this.#activePiece) {
            return
        }

        while (true) {
            this.#setActivePieceOnBoard(true)
            const newX = this.#activePiece.x
            const newY = this.#activePiece.y - 1

            if (this.#activePieceCanFitOnBoard(newX, newY)) {
                this.#activePiece.x = newX
                this.#activePiece.y = newY
                this.#setActivePieceOnBoard()
            } else {
                this.#setActivePieceOnBoard()
                break
            }
        }
    }

    moveLeft(): void {
        if (!this.isGameActive) {
            return
        }
        if (!this.#activePiece) {
            return
        }

        this.#setActivePieceOnBoard(true)
        const newX = this.#activePiece.x - 1
        const newY = this.#activePiece.y

        if (this.#activePieceCanFitOnBoard(newX, newY)) {
            this.#activePiece.x = newX
            this.#activePiece.y = newY
        }

        this.#setActivePieceOnBoard()
    }

    moveRight(): void {
        if (!this.isGameActive) {
            return
        }
        if (!this.#activePiece) {
            return
        }

        this.#setActivePieceOnBoard(true)
        const newX = this.#activePiece.x + 1
        const newY = this.#activePiece.y

        if (this.#activePieceCanFitOnBoard(newX, newY)) {
            this.#activePiece.x = newX
            this.#activePiece.y = newY
        }

        this.#setActivePieceOnBoard()
    }

    rotateCcw(): void {
        if (!this.isGameActive) {
            return
        }
        if (!this.#activePiece) {
            return
        }

        this.#setActivePieceOnBoard(true)
        this.#activePiece.block.rotateCcw()

        if (!this.#activePieceCanFitOnBoard(this.#activePiece.x, this.#activePiece.y)) {
            // Undo if it cannot fit
            this.#activePiece.block.rotateCw()
        }

        this.#setActivePieceOnBoard()
    }

    rotateCw(): void {
        if (!this.isGameActive) {
            return
        }
        if (!this.#activePiece) {
            return
        }

        this.#setActivePieceOnBoard(true)
        this.#activePiece.block.rotateCw()

        if (!this.#activePieceCanFitOnBoard(this.#activePiece.x, this.#activePiece.y)) {
            // Undo if it cannot fit
            this.#activePiece.block.rotateCcw()
        }

        this.#setActivePieceOnBoard()
    }

    #clearFullRows(): void {
        const isRowFull = (rowIdx: number) => {
            for (let c = 0; c < this.boardWidth; c++) {
                if (!this.#board[rowIdx][c]) {
                    return false
                }
            }

            return true
        }

        for (let r = 0; r < this.boardHeight; r++) {
            if (isRowFull(r)) {
                this.#board.splice(r, 1)
                this.#board.push(Array<BoardCol>(this.boardWidth).fill(null))
                this.#score += this.boardWidth
                r -= 1
            }
        }
    }

    #generateActivePiece(): void {
        const getRandomElement = <T>(array: ReadonlyArray<T>): T => {
            const i = Math.floor(Math.random() * array.length)
            return array[i]
        }

        const block = new Tetriminoe(getRandomElement(defaultTetriminoePoints))
        const material = getRandomElement(blockMaterials)

        this.#activePiece = {
            block,
            material,
            x: block.leftMargin + Math.floor((this.boardWidth - block.width) / 2),
            y: block.bottomMargin + this.boardHeight,
        }

        this.#setActivePieceOnBoard()
    }

    #setActivePieceOnBoard(remove = false): void {
        if (!this.#activePiece) {
            throw new Error('Invalid activePiece')
        }

        for (const point of this.#activePiece.block.rotatedPoints) {
            const xFinal = this.#activePiece.x + point[0]
            const yFinal = this.#activePiece.y + point[1]

            if (xFinal < 0) {
                continue
            }
            if (yFinal < 0) {
                continue
            }
            if (xFinal >= this.boardWidth) {
                continue
            }
            if (yFinal >= this.boardHeight) {
                continue
            }

            if (remove) {
                this.#board[yFinal][xFinal] = null
            } else {
                this.#board[yFinal][xFinal] = this.#activePiece.material
            }
        }
    }

    #activePieceCanFitOnBoard(x: number, y: number): boolean {
        if (!this.#activePiece) {
            throw new Error('Invalid activePiece')
        }

        for (const point of this.#activePiece.block.rotatedPoints) {
            const xFinal = x + point[0]
            const yFinal = y + point[1]

            if (xFinal < 0) {
                return false
            }
            if (yFinal < 0) {
                return false
            }
            if (xFinal >= this.boardWidth) {
                return false
            }
            if (yFinal >= this.boardHeight) {
                // Since piece cannot go up, we don't care about the case when some of it is above the board (e.g. at the start)
                continue
            }

            if (this.getBoardAt(xFinal, yFinal)) {
                return false
            }
        }

        return true
    }
}
