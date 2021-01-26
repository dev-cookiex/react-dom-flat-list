import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

const config: webpack.Configuration = {
  entry: path.resolve( 'web.tsx' ),
  module: {
    rules: [
      {
        test: /\.[tj]sx$/,
        use: [ 'babel-loader', 'awesome-typescript-loader' ]
      }, {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [ new HtmlWebpackPlugin() ],
  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ]
  }
}

export default config
