import getWebpackCommons from "./webpack.commons.js";

import { appConfig, getGameConfig } from "./webpack.routes.js";

console.log("mode", process.env.NODE_ENV);

const wpConfig = process.env.WP_CONFIG;
const gameName = process.env.GAME_NAME;

export default (

	wpConfig === "all" ?
		[...Object.values(appConfig), getGameConfig(gameName)] :
		[appConfig[wpConfig] || getGameConfig(gameName)]

).map(
	getWebpackCommons(process.env.NODE_ENV === "dev")
);