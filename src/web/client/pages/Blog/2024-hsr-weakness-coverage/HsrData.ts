import { BrandedType } from '@/@types/brand'
import { ResponsiveLoaderAsset } from '@/web/client/utils/ResponsiveLoaderAsset'
import bossData from './Bosses.csv'

export type HsrElement = BrandedType<string, 'HsrElement'>

export const hsrElements = [
    'Physical',
    'Fire',
    'Ice',
    'Lightning',
    'Wind',
    'Quantum',
    'Imaginary',
] as Array<HsrElement>

export function getHsrElementIcon(elementName: HsrElement): ResponsiveLoaderAsset {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`./icons/${elementName}.png?size=48`) as ResponsiveLoaderAsset
}

export type HsrEnemy = {
    name: string
    weaknesses: Array<boolean>
}

export const hsrEnemies = ((): Array<HsrEnemy> => {
    const enemies = new Array<HsrEnemy>()
    const lines = bossData.split('\n')

    for (const [idx, line] of lines.entries()) {
        // Skip first line of csv (headers)
        if (idx === 0) {
            continue
        }

        // Skip last line of csv (blank line)
        if (!line.trim()) {
            continue
        }

        const enemyData = line.split(',')
        const name = enemyData[0].trim()
        const weaknesses = enemyData.slice(1).map((val) => Boolean(val))

        enemies.push({
            name,
            weaknesses,
        })
    }

    return enemies
})()
