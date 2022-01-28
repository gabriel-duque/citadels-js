import { resolve } from "path";

export const appConfig = {

	"lobby": {

		input: {
			folder: resolve("views"),
			entry: "scripts/lobby.js",
			alias: {
				styles: "styles"
			}
		},
		output: {
			js: `lobby-bundle.js`,
			css: `global-styles.css`
			// js: `lobby-bundle.[hash].js`,
			// css: `global-styles.[hash].css`
		}
	},


	"room": {

		input: {
			folder: resolve("views"),
			entry: "scripts/room.js",
		},

		output: {
			js: `room-bundle.js`,
			// js: `room-bundle.[hash].js`,
		}
	}

};

export const getGameConfig = gameName => ({

	input: {
		folder: resolve(`${gameName}/client`),
		entry: `${gameName}.js`,
		template: `${gameName}.ejs`,
		// alias: {
		//   styles: "styles",
		// }
	},

	output: {
		folder: resolve(`dist/${gameName}`),
		html: `${gameName}-play.html`,
		js: `${gameName}-bundle.js`,
		css: `${gameName}-styles.css`
		// js: `${gameName}-bundle.[hash].js`,
		// css: `${gameName}-styles.[hash].css`
	}
})