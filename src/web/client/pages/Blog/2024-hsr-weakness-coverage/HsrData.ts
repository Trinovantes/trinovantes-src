import { BrandedType } from '@/@types/brand'
import { ResponsiveLoaderAsset } from '@/web/client/utils/ResponsiveLoaderAsset'

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
    // Exported as CSV
    const enemyData = `
        Memory Zone Meme - Shell of Faded Rage,,,,x,,x,x
        Ten Stonehearts - Aventurine of Stratagems,x,,x,x,,,
        Dreamjolt Troupe's Beyond Overcooked,,x,,x,x,,
        Dreamjolt Troupe's Sweet Gorilla,x,x,,,,,x
        Memory Zone Meme - Something Unto Death,,x,,,x,,x
        Stellaron Hunter - Sam,,,,x,,x,x
        Argenti,x,x,x,,,,
        Aurumaton Spectral Envoy,x,,,x,,,x
        Senior Staff - Team Leader,,x,x,,,,x
        The Swarm - True Sting (Complete),,,,,,x,x
        The Ascended,x,,x,x,,,
        Abundance Sprite - Malefic Ape,,x,x,,x,,
        Cloud Knight Lieutenant: Yanqing,,,,x,x,,x
        Abundant Ebon Deer,,x,x,,,x,
        Stellaron Hunter: Kafka,x,,,,x,,x
        Automaton Direwolf,,,x,x,,,x
        Automaton Grizzly,,x,x,x,,,
        Blaze Out of Space,x,,x,,,x,
        Ice Out of Space,,x,,,x,x,
        Cocolia,,x,,x,,x,
        Bronya,x,x,,,,,x
        Gepard,x,,,x,,,x
        Guardian Shadow,x,,,,x,x,
        Decaying Shadow,,x,,x,x,,
        Searing Prowler,,,x,x,,,x
        Frigid Prowler,,x,,x,,x,
        Svarog,,x,,x,x,,
        Silvermane Lieutenant,x,,x,,,x,
        Voidranger - Trampler,x,,,,x,,x
        Stormbringer,,x,x,,,,x
        Disciples of Sanctus Medicus - Shape Shifter,,,x,,x,,x
        Aurumaton Gatekeeper,,,,x,x,x,
    `

    const enemies = new Array<HsrEnemy>()
    const lines = enemyData.split('\n')

    for (const line of lines) {
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
