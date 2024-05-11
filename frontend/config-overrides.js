import { override, addWebpackAlias } from 'customize-cra'
import path from 'path'


module.exports = override(
    addWebpackAlias({
        // 指定@符指向src目录
        '@': path.resolve(__dirname, 'src'),
    })
)
