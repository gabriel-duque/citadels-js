import path from "path";

export const serverConfig = gameName => ({

  routes: {
    lobby: {
      publicPath: `/${gameName}-lobby`,
      fileName: `${gameName}-lobby`,
      ioNamespace: `/${gameName}-lobby`,
    },

    play: {
      publicPath: `/${gameName}-play`,
      fileName: `${gameName}-play`,
      ioNamespace: `/${gameName}-play`,
    }
  }
});

export const frontConfig = gameName => ({

  home: {

    input: {
      folder: path.resolve("src/home"),
      entry: `home.js`,
      // template: `home.ejs`,
      alias: {
        styles: "styles",
        lobby: "home"
      }
    },

    output: {
      folder: path.resolve(`dist/home`),
      publicPath: `/`,
      // html: `home.html`,
      js: `home-bundle.js`,
      css: `home-styles.css`
      // js: `[name].[hash].js`,
      // css: `[name].[hash].css`
    }
  },

  lobby: {

    input: {
      folder: path.resolve(`src/${gameName}`),
      entry: `${gameName}-lobby/${gameName}-lobby.js`,
      template: `${gameName}-lobby/${gameName}-lobby.ejs`,
      alias: {
        styles: "styles",
        lobby: "lobby"
      }
    },

    output: {
      folder: path.resolve(`dist/${gameName}`),
      publicPath: `/`,
      html: `${gameName}-lobby.html`,
      js: `${gameName}-lobby-bundle.js`,
      css: `${gameName}-lobby-styles.css`
      // js: `[name].[hash].js`,
      // css: `[name].[hash].css`
    }
  },

  play: {

    input: {
      folder: path.resolve(`src/${gameName}`),
      entry: `${gameName}-play/${gameName}-play.js`,
      template: `${gameName}-play/${gameName}-play.ejs`,
      alias: {
        styles: "styles",
        play: "play"
      }
    },

    output: {
      folder: path.resolve(`dist/${gameName}`),
      publicPath: `/`,
      html: `${gameName}-play.html`,
      js: `${gameName}-play-bundle.js`,
      css: `${gameName}-play-styles.css`
      // js: `vvmap.[hash].js`,
      // css: `vvmap.[hash].css`
    }
  }
})