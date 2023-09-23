import { merge } from 'webpack-merge'
import { srcReadmeDir, distReadmeDir } from './BuildConstants'
import { commonNodeConfig } from './webpack.common'

// ----------------------------------------------------------------------------
// Api
// ----------------------------------------------------------------------------

export default merge(commonNodeConfig, {
    entry: {
        generateReadme: `${srcReadmeDir}/run.ts`,
    },

    output: {
        path: distReadmeDir,
    },
})
