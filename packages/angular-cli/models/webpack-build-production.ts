import * as path from 'path';
const WebpackMd5Hash = require('webpack-md5-hash');
import * as webpack from 'webpack';

declare module 'webpack' {
  export interface LoaderOptionsPlugin {}
  export interface LoaderOptionsPluginStatic {
    new (optionsObject: any): LoaderOptionsPlugin;
  }
  interface Webpack {
    LoaderOptionsPlugin: LoaderOptionsPluginStatic;
  }
}

export const getWebpackProdConfigPartial = function(projectRoot: string, appConfig: any) {
  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(projectRoot, appConfig.outDir),
      filename: `${appConfig.assetsOutDir}/[name].[chunkhash].bundle.js`,
      sourceMapFilename: `${appConfig.assetsOutDir}/[name].[chunkhash].bundle.map`,
      chunkFilename: `${appConfig.assetsOutDir}/[id].[chunkhash].chunk.js`
    },
    plugins: [
      new WebpackMd5Hash(),
      new webpack.optimize.UglifyJsPlugin(<any>{
        mangle: { screw_ie8 : true },
        compress: { screw_ie8: true },
        sourceMap: true
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          },
          postcss: [
            require('postcss-discard-comments')
          ]
        }
      })
    ],
    node: {
      fs: 'empty',
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
};
