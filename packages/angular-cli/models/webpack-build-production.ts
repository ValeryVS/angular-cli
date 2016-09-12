import * as path from 'path';
const WebpackMd5Hash = require('webpack-md5-hash');
import * as webpack from 'webpack';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractTextPluginPublicPath = '../';

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
  const appRoot = path.resolve(projectRoot, appConfig.root);
  const styles = appConfig.styles
               ? appConfig.styles.map((style: string) => path.resolve(appRoot, style))
               : [];
  const cssLoaders = [
    'css-loader?sourcemap&minimize&name=' + appConfig.assetsOutDir + '/[hash].[ext]',
    'postcss-loader'
  ];
  return {
    output: {
      path: path.resolve(projectRoot, appConfig.outDir),
      filename: `${appConfig.assetsOutDir}/[name].[chunkhash].bundle.js`,
      sourceMapFilename: `${appConfig.assetsOutDir}/[name].[chunkhash].bundle.map`,
      chunkFilename: `${appConfig.assetsOutDir}/[id].[chunkhash].chunk.js`
    },
    module: {
      rules: [
        // outside of main, load it via extract-text-plugin for production builds
        {
          include: styles,
          test: /\.css$/,
          loaders: ExtractTextPlugin.extract({
            loader: cssLoaders,
            publicPath: extractTextPluginPublicPath
          })
        }, {
          include: styles,
          test: /\.styl$/,
          loaders: ExtractTextPlugin.extract({
            loader: [
              ...cssLoaders,
              `stylus-loader?sourcemap&name=${appConfig.assetsOutDir}/[hash].[ext]`
            ],
            publicPath: extractTextPluginPublicPath
          })
        }, {
          include: styles,
          test: /\.less$/,
          loaders: ExtractTextPlugin.extract({
            loader: [
              ...cssLoaders,
              `less-loader?sourcemap&name=${appConfig.assetsOutDir}/[hash].[ext]`
            ],
            publicPath: extractTextPluginPublicPath
          })
        }, {
          include: styles,
          test: /\.scss$|\.sass$/,
          loaders: ExtractTextPlugin.extract({
            loader: [
              ...cssLoaders,
              `sass-loader?sourcemap&name=${appConfig.assetsOutDir}/[hash].[ext]`
            ],
            publicPath: extractTextPluginPublicPath
          })
        },
      ]
    },
    plugins: [
      new ExtractTextPlugin(`${appConfig.assetsOutDir}/[name].[contenthash].bundle.css`),
      new WebpackMd5Hash(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin(<any>{
        mangle: { screw_ie8 : true },
        compress: { screw_ie8: true },
        sourceMap: true
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [
            require('postcss-discard-comments')
          ]
        }
      })
    ]
  };
};
