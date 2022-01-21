import { app, io } from './server/server.js';
import Router from './server/router.js';
import GameRooms from './games.js';
import GameRouter from './server/game-router.js';

import Debug from './debug.config.js';
const debug = Debug('main');

app.use(Router.getPublicPath(''));

app.get("/", (_, res) => {

  debug("Rendering page home");

  res.render('pages/home', { games: Object.keys(GameRooms) });
});

app.get(/\/\w+-lobby/, (req, res, next) => {

  const [gameName] = req.url.match(/(?<=\/)(\w*)(?=-lobby)/);

  debug("Rendering lobby page for game", gameName);

  res.render('pages/lobby', { gameName });

  // next();
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

app.use(Router.redirectAtRoot);