import { merge } from 'webpack-merge'
import { srcApiDir, distApiDir } from './BuildConstants'
import { commonNodeConfig } from './webpack.common'

// ----------------------------------------------------------------------------
// Api
// ----------------------------------------------------------------------------

export default merge(commonNodeConfig, {
    entry: {
        www: `${srcApiDir}/www.ts`,
    },

    output: {
        path: distApiDir,
    },
})
