import getWebpackCommons from "./webpack.commons.js";

import { frontConfig } from "./routes.config.js";

const isDevMode = process.env.NODE_ENV === "dev";

const isAnalyseMode = process.env.NODE_ENV === "analyse";

console.log(
  `\r\n---------------------------------\r\n\r\n
              mode : ${process.env.NODE_ENV}
  \r\n\r\n---------------------------------\r\n`
);

const wpConfig = process.env.WP_CONFIG;

const gameConfig = frontConfig(process.env.GAME_NAME);

const configs =
  wpConfig === "all" ?
  Object.values(gameConfig) : [gameConfig[wpConfig]];


export default configs.map(config =>
  getWebpackCommons(config, { isAnalyseMode, isDevMode })
);