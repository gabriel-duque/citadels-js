import path from "path";

export const frontConfig = gameName => ({

  home: {

    input: {
      folder: path.resolve("src"),
      entry: `home.css`,
    },

    output: {
      folder: path.resolve(`dist`),
      publicPath: `/`,
      js: `home-bundle.js`,
      css: `home-styles.css`
      // js: `home-bundle.[hash].js`,
      // css: `home-styles.[hash].css`

    }
  },

  lobby: {

    input: {
      folder: path.resolve(`src`),
      entry: `lobby.js`,
    },

    output: {
      folder: path.resolve(`dist`),
      publicPath: `/`,
      js: `lobby-bundle.js`,
      css: `lobby-styles.css`
      // js: `lobby-bundle.[hash].js`,
      // css: `lobby-styles.[hash].css`
    }
  },

  play: {

    input: {
      folder: path.resolve(`src/${gameName}`),
      entry: `${gameName}.js`,
      template: `${gameName}.ejs`,
      // alias: {
      //   styles: "styles",
      //   play: "play"
      // }
    },

    output: {
      folder: path.resolve(`dist/${gameName}`),
      publicPath: `/`,
      html: `${gameName}-play.html`,
      js: `${gameName}-bundle.js`,
      css: `${gameName}-styles.css`
      // js: `vvmap.[hash].js`,
      // css: `vvmap.[hash].css`
    }
  }
})