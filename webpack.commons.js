import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import postCssNormalize from "postcss-normalize";
import postCssPresetEnv from "postcss-preset-env";

const babelLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: "babel-loader"
};

const ejsLoader = {
  test: /\.ejs$/,
  use: [{
    loader: "ejs-loader",
    options: {
      esModule: false
    }
  }]
};

const cssLoaders = {
  test: /\.css$/,
  use: [{
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: "css-loader",
      options: {
        importLoaders: 1
      }
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            postCssNormalize(),
            postCssPresetEnv({
              stage: 3,
              features: {
                "nesting-rules": true
              }
            })
          ]
        }
      }
    }
  ]
}

export default (config, {
  isAnalyseMode,
  isDevMode
}) => ({

  target: "web",

  mode: isDevMode ? "development" : "production",

  watch: isDevMode,

  entry: `${config.input.folder}/${config.input.entry}`,

  resolve: {
    alias: getAliases(config)
  },

  output: {
    filename: config.output.js,
    path: config.output.folder,
    publicPath: config.output.publicPath
  },

  optimization: {
    minimize: !isDevMode,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },

  module: {
    rules: [
      !isDevMode && babelLoader,
      ejsLoader,
      cssLoaders
    ].filter(Boolean)
  },

  plugins: [

    isDevMode && new ESLintPlugin({
      emitWarning: true,
    }),

    isAnalyseMode && new BundleAnalyzerPlugin(),

    new MiniCssExtractPlugin({
      filename: config.output.css,
    }),

    new HtmlWebpackPlugin({
      filename: config.output.html,
      inject: config.output.inject ?? true,
      template: `${config.input.folder}/${config.input.template}`,
    })

  ].filter(Boolean),
});

function getAliases(config, output = {}) {

  Object.entries(config.input.alias)
    .forEach(([key, value]) => {
      Object.assign(output, {
        [key]: `${config.input.folder}/${value}/`
      });
    });

  return output
}