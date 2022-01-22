import path from "path";

export const frontConfig = gameName => ({


  lobbies: {
    input: {
      folder: path.resolve("src"),
      entry: "lobbies.js"
    },
    output: {
      js: `lobbies-bundle.js`,
      css: `lobby-styles.css`
      // js: `lobbies-bundle.[hash].js`,
      // css: `lobby-styles.[hash].css`
    }
  },


  lobby: {
    input: {
      folder: path.resolve("src"),
      entry: "lobby.js"
    },
    output: {
      js: `lobby-bundle.js`,
      // js: `lobby-bundle.[hash].js`,
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
      // js: `vvmap.[hash].js`,
      // css: `vvmap.[hash].css`
    }
  }
})