export const VONWACQ_ADVANCE = 0.4
export const EAGLE_ADVANCE = 0.25
export const DDD_ADVANCE = 0.25

export type HsrTurn = {
    turnNum: number
    actionValue: number
    time: number
    hasCastUlt?: boolean
}

export type HsrCharOptions = {
    speed: number
    turnsForUlt: number
    hasVonwacq: boolean
    hasEagle: boolean
    hasDdd: boolean
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

export function computeUnitTurns(maxAv: number, charOpts: HsrCharOptions): Array<HsrTurn> {
    const turns = new Array<HsrTurn>()
    const baseActionValue = getAvFromSpeed(charOpts.speed)
    const EPSILON = 0.0001

    let turnNum = 0
    let currTurntime = 0
    let prevTurnTime = 0

    while (currTurntime + EPSILON < maxAv) {
        const isFirstTurn = turnNum === 0
        const hasCastUlt = turnNum % charOpts.turnsForUlt === 0

        turnNum += 1
        currTurntime += baseActionValue

        if (isFirstTurn && charOpts.hasVonwacq) {
            currTurntime -= baseActionValue * VONWACQ_ADVANCE
        }
        if (hasCastUlt && charOpts.hasEagle) {
            currTurntime -= baseActionValue * EAGLE_ADVANCE
        }
        if (hasCastUlt && charOpts.hasDdd) {
            currTurntime -= baseActionValue * DDD_ADVANCE
        }

        turns.push({
            turnNum,
            actionValue: currTurntime - prevTurnTime,
            time: currTurntime,
            hasCastUlt,
        })

        prevTurnTime = currTurntime
    }

    return turns
}
