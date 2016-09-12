const path = require('path');

import * as webpack from 'webpack';

declare module 'webpack' {
    export interface LoaderOptionsPlugin {}
    export interface LoaderOptionsPluginStatic {
        new (optionsObject: any): LoaderOptionsPlugin;
    }
    interface Webpack {
        LoaderOptionsPlugin: LoaderOptionsPluginStatic;
    }
};

export const getWebpackDevConfigPartial = function(projectRoot: string, appConfig: any) {
  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(projectRoot, appConfig.outDir),
      filename: `${appConfig.assetsOutDir}/[name].bundle.js`,
      sourceMapFilename: `${appConfig.assetsOutDir}/[name].map`,
      chunkFilename: `${appConfig.assetsOutDir}/[id].chunk.js`
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: path.resolve(projectRoot, appConfig.root)
          },
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
