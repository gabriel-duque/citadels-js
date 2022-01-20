import { app, io } from './server/server.js';
import Router from './server/router.js';
import GameRooms from './games.js';
import GameRouter from './server/game-router.js';
import debug from 'debug';


// app.get('/', Router.askForFile('home'));
// app.use(Router.getPublicPath('home'));


app.get("/", (_, res) => {

  debug("Rendering page home");

  res.render('pages/home', { games: Object.keys(GameRooms)});
});
app.use(Router.getPublicPath('styles'));



app.get("/lobby", (_, res) => {

  debug("Rendering page test");

  res.render('pages/lobby', { gameName: "test" });
});

for (const gameName in GameRooms) {

  const gameRouter = new GameRouter(gameName, GameRooms[gameName], io);

  app.get(`/${gameName}`,
    gameRouter.createRoomIfNotExists.bind(gameRouter),
    gameRouter.redirectToLobby.bind(gameRouter)
  );

  for (const route of Object.values(gameRouter.GameRoom.routes)) {

    io.initNamespace(route.ioNamespace);

    app.get(route.publicPath,
      gameRouter.makeSureRoomExists.bind(gameRouter),
      Router.askForFile(route.fileName));
  }

  app.use(Router.getPublicPath(gameName));
}

// app.use(Router.redirectAtRoot);