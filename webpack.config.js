const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Your React entry file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true, // Clears old files on build
    publicPath: "/",
  },
  mode: "development",
  devtool: "inline-source-map",

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // JS + JSX + TS + TSX
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i, // CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|bmp)$/i, // Images
        type: "asset/resource",
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i, // Fonts
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html" // HTML template
      //favicon: "./public/favicon.ico", // optional
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
    historyApiFallback: true, // For React Router
    hot: true,
    open: true,
  },
};
