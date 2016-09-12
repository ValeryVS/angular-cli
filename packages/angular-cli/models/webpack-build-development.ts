const path = require('path');

export const getWebpackDevConfigPartial = function(projectRoot: string, appConfig: any) {
  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(projectRoot, appConfig.outDir),
      filename: `${appConfig.assets}/[name].bundle.js`,
      sourceMapFilename: `${appConfig.assets}/[name].map`,
      chunkFilename: `${appConfig.assets}/[id].chunk.js`
    },
    tslint: {
      emitErrors: false,
      failOnHint: false,
      resourcePath: path.resolve(projectRoot, appConfig.root)
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
