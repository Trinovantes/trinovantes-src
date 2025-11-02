// preload.ts

import path from 'node:path'
import { readFileSync } from 'node:fs'
import { parseConfigFileTextToJson, type CompilerOptions } from 'typescript'
import { registerHooks } from 'node:module'
import { pathToFileURL } from 'node:url'

const tsconfigPath = path.resolve('./tsconfig.json')
const tsconfigContents = readFileSync(tsconfigPath, 'utf8')
const tsconfigParseResult = parseConfigFileTextToJson('./tsconfig.json', tsconfigContents)
const tsconfig = tsconfigParseResult.config as { compilerOptions: CompilerOptions }

const aliasMap = new Array<[string, string]>()
const baseUrl = path.resolve(path.dirname(tsconfigPath), tsconfig.compilerOptions?.baseUrl ?? '.')

for (const [alias, targets] of Object.entries(tsconfig.compilerOptions?.paths || {})) {
    const aliasIsWildcard = alias.endsWith('/*')
    const aliasPrefix = aliasIsWildcard ? alias.slice(0, -1) : alias

    for (const target of targets) {
        const aliasTarget = aliasIsWildcard ? target.slice(0, -1) : target
        aliasMap.push([aliasPrefix, aliasTarget])
    }
}

registerHooks({
    resolve: (specifier, context, nextResolve) => {
        for (const [aliasPrefix, aliasTarget] of aliasMap) {
            if (specifier.startsWith(aliasPrefix)) {
                const restOfPath = specifier.substring(aliasPrefix.length)
                const resolvedPath = path.resolve(baseUrl, aliasTarget, restOfPath)

                return {
                    shortCircuit: true,
                    url: pathToFileURL(resolvedPath).href,
                }
            }
        }

        return nextResolve(specifier, context)
    },
})
