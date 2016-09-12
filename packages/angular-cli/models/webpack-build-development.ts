const path = require('path');

export const getWebpackDevConfigPartial = function(projectRoot: string, appConfig: any) {
  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(projectRoot, appConfig.outDir),
      filename: `${appConfig.assetsOutDir}/[name].bundle.js`,
      sourceMapFilename: `${appConfig.assetsOutDir}/[name].map`,
      chunkFilename: `${appConfig.assetsOutDir}/[id].chunk.js`
    }
  };
};
