export function chooseFromSet<T>(set: Array<T>, n: number): Array<Array<T>> {
    if (n === 0) {
        return [[]]
    }
    if (n === 1) {
        return set.map((el) => [el])
    }
    if (n > set.length) {
        return []
    }

    let results = new Array<Array<T>>()

    for (let i = 0; i < set.length - (n - 1); i++) {
        const currentElement = set[i]
        const subSets = chooseFromSet(set.slice(i + 1), n - 1)

        for (const subSet of subSets) {
            subSet.unshift(currentElement)
        }

        results = results.concat(subSets)
    }

    return results
}
