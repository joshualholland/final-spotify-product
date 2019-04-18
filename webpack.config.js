const path = require('path');
var nodeExternals = require('webpack-node-externals');

const serverConfig = (env, argv) => {

  return {
    mode: process.env.NODE_ENV || 'development',
    entry: './server/src',
    module: {
      rules: [
        {
            test: /.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
            },
        },
        {
            test: /.css?$/,
            use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.jsx', '.js']
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    },
    target: 'node',
    node: {
      __dirname: false
    },
    externals: [nodeExternals()]
  }
};

const clientConfig = {
    mode: process.env.NODE_ENV || 'development',
    entry: './client/src/index.js',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
            test: /.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
            },
        },
        {
            test: /.css?$/,
            use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.jsx', '.js', '.css']
    },
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'public/js')
    }
  };

module.exports = [serverConfig, clientConfig];