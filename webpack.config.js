const webpack = require('webpack');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');
const path = require('path')

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + '/src',
  entry: {
    'background': './scripts/background/index.js',
    'content_script': './scripts/content_script/index.js',
    '../docs/style': './styles/docs.js',
    'oembed/style': './styles/embed.js',

    'players/Youtube': './scripts/content_script/video/players/Youtube-medium.js',
    'players/Youtube-tiny': './scripts/content_script/video/players/Youtube-tiny.js',
    'players/Youtube-small': './scripts/content_script/video/players/Youtube-small.js',
    'players/Youtube-medium': './scripts/content_script/video/players/Youtube-medium.js',
    
    // 'players/Dailymotion': './scripts/content_script/video/players/Dailymotion.js',
    // 'players/Youporn': './scripts/content_script/video/players/Youporn.js',
    // 'players/Vimeo': './scripts/content_script/video/players/Vimeo.js',
    // 'players/Twitch': './scripts/content_script/video/players/Twitch.js',
    
    'players/Gif': './scripts/content_script/image/players/Gif.js',
    'popup/popup': './popup/popup.js',
    'options/options': './options/options.js',
    
    // 'injected-style.css': './scss/injected-style.scss',
    // './scss/injected-style.scss': './scss/injected-style.scss',
    //'utils/compute-styles': './scripts/content_script/utils/compute-styles.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    // filename: path.resolve(__dirname, './public/assets/[name]'),
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc.js'
          // eslint options (if necessary)
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/images/',
          emitFile: false,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          emitFile: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      global: 'window',
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'images', to: 'images' },
      { from: 'oembed', to: 'oembed' },
      { from: 'lists', to: 'lists' },
      // { from: 'scripts/content_script/players', to: 'players' },
      { from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
      { from: 'options/options.html', to: 'options/options.html', transform: transformHtml },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: (content) => {
          const jsonContent = JSON.parse(content);
          jsonContent.version = version;

          if (config.mode === 'development') {
            jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
          }

          return JSON.stringify(jsonContent, null, 2);
        },
      },
    ]),
  ],
};

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ]);
}

if (process.env.HMR === 'true') {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      manifest: __dirname + '/src/manifest.json',
    }),
  ]);
}

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

module.exports = config;
