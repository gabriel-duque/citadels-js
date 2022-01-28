import path from "path";

export const frontConfig = gameName => ({


  lobby: {
    input: {
      folder: path.resolve("views"),
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


  room: {
    input: {
      folder: path.resolve("views"),
      entry: "scripts/room.js",
      styles: "styles"
    },
    output: {
      js: `room-bundle.js`,
      // js: `room-bundle.[hash].js`,
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