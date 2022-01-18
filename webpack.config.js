import path from "path";

import getWebpackConfig from "./webpack.commons.js";

const CONFIGS = {

  lobby: {

    input: {
      folder: path.resolve("src"),
      entry: "lobby/lobby.js",
      template: "lobby/lobby.ejs",
      alias: {
        styles: "styles",
        lobby: "lobby"
      }
    },

    output: {
      folder: path.resolve("dist"),
      publicPath: "./",
      html: "lobby.html",
      js: "lobby-bundle.js",
      css: "lobby-styles.css"
      // js: "vvmap.[hash].js",
      // css: "vvmap.[hash].css"
    }
  },

  game: {

    input: {
      folder: path.resolve("src"),
      entry: "game/game.js",
      template: "game/game.ejs",
      alias: {
        styles: "styles",
        game: "game"
      }
    },

    output: {
      folder: path.resolve("dist"),
      publicPath: "./",
      html: "game.html",
      js: "game-bundle.js",
      css: "game-styles.css"
      // js: "vvmap.[hash].js",
      // css: "vvmap.[hash].css"
    }
  }
}

const isDevMode = process.env.NODE_ENV === "dev";

const isAnalyseMode = process.env.NODE_ENV === "analyse";

console.log(
  "\r\n---------------------------------\r\n\r\n",
  `            mode : ${process.env.NODE_ENV}`,
  "\r\n\r\n---------------------------------\r\n"
);

export default process.env.WP_CONFIG === "all" ? Object.values(CONFIGS)
  .map(c =>
    getWebpackConfig(c, { isAnalyseMode, isDevMode })
  ) :
  getWebpackConfig(CONFIGS[process.env.WP_CONFIG], { isAnalyseMode, isDevMode });