export const VONWACQ_ADVANCE = 0.4

export type HsrTurn = {
    turnNum: number
    actionValue: number
    time: number
}

export function getTotalAv(numCycles: number): number {
    if (numCycles === 1) {
        return 150
    }

    return 150 + (numCycles - 1) * 100
}

export function getTargetSpeed(numCycles: number, numTurns: number, hasVonwacq?: boolean | null): number {
    const totalAv = getTotalAv(numCycles)
    if (hasVonwacq) {
        return 10000 / totalAv * (numTurns - VONWACQ_ADVANCE)
    } else {
        return 10000 / totalAv * (numTurns)
    }
}

export function getAvFromSpeed(speed: number): number {
    return 10000 / speed
}

export function computeCycleTurns(numCycles: number): Array<HsrTurn> {
    const turns = new Array<HsrTurn>()
    let time = 0

    for (let i = 0; i < numCycles; i++) {
        const actionValue = (i === 0) ? 150 : 100
        time += actionValue

        turns.push({
            turnNum: i,
            actionValue,
            time,
        })
    }

    return turns
}

export function computeUnitTurns(speed: number, maxAv: number, hasVonwacq?: boolean | null): Array<HsrTurn> {
    const turns = new Array<HsrTurn>()
    const baseActionValue = getAvFromSpeed(speed)
    const EPSILON = 0.0001

    let turnNum = 0
    let time = 0

    while (time + EPSILON < maxAv) {
        const actionValue = (turnNum === 0 && hasVonwacq) ? baseActionValue * (1 - VONWACQ_ADVANCE) : baseActionValue

        turnNum += 1
        time += actionValue

        turns.push({
            turnNum,
            actionValue,
            time,
        })
    }

    return turns
}
