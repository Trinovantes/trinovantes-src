import { writeFile } from 'node:fs/promises'
import { ReadmeGenerator } from './ReadmeGenerator'

async function main() {
    const generator = new ReadmeGenerator()
    const output = await generator.generate()
    await writeFile('./README.md', output)
}

main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
})
