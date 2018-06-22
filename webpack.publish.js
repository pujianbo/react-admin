var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webConfig = require('./src/config'); //服务配置
var publicPath = 'dist/'; //服务器路径

module.exports = {
  entry: {
    index: ['./src/index']
  },
  output: {
    // publicPath: publicPath, //服务器路径
    path: path.join(__dirname, publicPath), //当前路径
    filename: 'js/[name][hash:5].js'
  },
  externals: {
    'jquery': '$'
  },
  devServer: { //服务代理
    contentBase: publicPath,
    port: webConfig.port,
    host: webConfig.getIP(),
    proxy: webConfig.getAgent(),
    disableHostCheck: true,
    historyApiFallback: true, //不跳转
    inline: true
    // hot: true
  },
  module: {
    loaders: [{
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime', ['import', [{
            libraryName: 'antd',
            style: 'css'
          }]]],
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.(scss|sass|px)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      // {
      //     test: /\.(jsx|scss|sass)$/,
      //     loader: 'webpack-px-to-rem',
      //     query: {
      //         basePx: 25,
      //         min: 1,
      //         floatWidth: 2
      //     }
      // },
      {
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'url-loader?limit=3000&name=img/[name][hash:5].[ext]'
      },
      {
        test: /\.(eot|woff|ttf|svg)$/,
        loader: 'url-loader?limit=3000&name=font/[ext]/[name][hash:5].[ext]'
      },
      {
        test: /\.(mp3|wav|ogg)$/,
        loader: 'url-loader?limit=3000&name=audio/[name][hash:5].[ext]'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'src/img'),
      to: path.join(__dirname, 'dist/img')
    }, {
      from: path.join(__dirname, 'src/static'),
      to: path.join(__dirname, 'dist/static')
    }]),
    new webpack.optimize.UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: true, //去掉警告
        drop_console: true //去掉console
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      async: "common-in-lazy",
      children: true,
      minChunks: ({
        resource
      } = {}) => (
        resource &&
        resource.includes('node_modules') &&
        /axios/.test(resource)
      )
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      children: true,
      async: 'used-twice',
      minChunks: (module, count) => (
        count >= 2
      ),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: ({
        resource
      }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.(js|jsx)$/)
      )
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackPlugin({
      filename: 'index.html', //生成的html存放路径，相对于 path
      template: './src/Template/index.html', //html模板路径
      favicon: __dirname + '/src/img/logo.ico',
      chunks: ['index', 'vendors'],
      inject: 'body',
      hash: true,
      cache: true,
      minify: {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      },
      title: '康医生后端管理系统',
      keywords: '关键字',
      description: '网站描述'
    })
  ],
  resolve: {
    extensions: [' ', '.js', '.jsx'] //自动扩展文件后缀名
  }
};
