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

const configName = process.env.WP_CONFIG;

const config = CONFIGS[configName];


const nodeEnv = process.env.NODE_ENV;

const isDevMode = nodeEnv === "dev";

const isAnalyseMode = nodeEnv === "analyse";


console.log(
  "\r\n---------------------------------\r\n\r\n",
  `Config : ${configName} | mode : ${nodeEnv}`,
  "\r\n\r\n---------------------------------\r\n"
);


export default getWebpackConfig(config, { isAnalyseMode, isDevMode });
