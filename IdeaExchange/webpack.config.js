var path = require('path');
var webpack = require('webpack');


module.exports = {
  target: 'web',

  entry: [
    './public/main.jsx'
  ],

  output: {
    path: path.join(process.cwd(), '/client'),
    pathInfo: true,
    publicPath: 'http://localhost:3000/public/',
    filename: 'main.js'
  },

  resolve: {
    root: path.join(__dirname, ''),
    modulesDirectories: [
      'web_modules',
      'node_modules',
      'public'
    ],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx','.json']
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: env.development,
      __STAGING__: env.staging,
      __PRODUCTION__: env.production,
      __CURRENT_ENV__: '\'' + (NODE_ENV) + '\''
    })
  ],

  module: {
    loaders: [
      {
        /* convert scss */
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
      }, {
        /* File Exporter to include any images */
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        exclude:/icons/,
        loader: 'url?limit=8192&name=assets/images/[name].[ext]'
      }, {
        /* Export Fonts */
        test: /\.(eot|woff|ttf)$/,
        loader: 'file?name=[name].[ext]&context=/'
      }
    ],

    noParse: /\.min\.js/
  }
};
