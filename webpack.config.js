var webpack = require('webpack')
var path = require('path')
var argv = require('yargs').argv

var pkg = require('./package.json')
var banner = [
  '/*!',
  ` * ${pkg.name} - v${pkg.version}`,
  ` * ${pkg.description}`,
  ` * ${pkg.homepage}`,
  ' *',
  ` * @author ${pkg.author}`,
  ` * @license ${pkg.license}`,
  ' */',
  ''
].join('\n')

module.exports = {
  entry: './src/GentleForm.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'GentleForm' + (argv.p ? '.min' : '') + '.js',
    library: 'GentleForm',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner, { raw: true })
  ]
}
