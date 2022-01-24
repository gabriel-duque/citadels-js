import path from "path";

export const frontConfig = gameName => ({


  gameLobby: {
    input: {
      folder: path.resolve("views"),
      entry: "scripts/game-lobby.js",
      alias: {
        styles: "styles"
      }
    },
    output: {
      js: `game-lobby-bundle.js`,
      css: `lobby-styles.css`
      // js: `game-lobby-bundle.[hash].js`,
      // css: `lobby-styles.[hash].css`
    }
  },


  gameRoom: {
    input: {
      folder: path.resolve("views"),
      entry: "scripts/game-room.js",
      styles: "styles"
    },
    output: {
      js: `game-room-bundle.js`,
      // js: `game-room-bundle.[hash].js`,
    }
  },

  play: {

    input: {
      folder: path.resolve(`${gameName}/client`),
      entry: `${gameName}.js`,
      template: `${gameName}.ejs`,
      // alias: {
      //   styles: "styles",
      //   play: "play"
      // }
    },

    output: {
      folder: path.resolve(`dist/${gameName}`),
      html: `${gameName}-play.html`,
      js: `${gameName}-bundle.js`,
      css: `${gameName}-styles.css`
      // js: `${gameName}-bundle.[hash].js`,
      // css: `${gameName}-styles.[hash].css`
    }
  }
})