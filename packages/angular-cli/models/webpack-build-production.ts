import * as path from 'path';
const WebpackMd5Hash = require('webpack-md5-hash');
import * as webpack from 'webpack';

export const getWebpackProdConfigPartial = function(projectRoot: string, appConfig: any) {
  return {
    debug: false,
    devtool: 'source-map',
    output: {
      path: path.resolve(projectRoot, appConfig.outDir),
      filename: `${appConfig.assets}/[name].[chunkhash].bundle.js`,
      sourceMapFilename: `${appConfig.assets}/[name].[chunkhash].bundle.map`,
      chunkFilename: `${appConfig.assets}/[id].[chunkhash].chunk.js`
    },
    plugins: [
      new WebpackMd5Hash(),
      new webpack.optimize.UglifyJsPlugin(<any>{
        mangle: { screw_ie8 : true },
        compress: { screw_ie8: true }
      })
    ],
    tslint: {
      emitErrors: true,
      failOnHint: true,
      resourcePath: path.resolve(projectRoot, appConfig.root)
    },
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
    node: {
      fs: 'empty',
      global: 'window',
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
};
