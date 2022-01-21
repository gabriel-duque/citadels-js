import { app, io } from './server/server.js';
import Router from './server/router.js';
import GameRooms from './games.js';
import GameRouter from './server/game-router.js';

import Debug from './debug.config.js';
const debug = Debug('main');

app.use(Router.getPublicPath(''));

app.get("/", Router.render("home", { games: Object.keys(GameRooms) }));

app.get(/\/\w+-lobby/, Router.render("lobby", url => {

  return { gameName: url.match(/(?<=\/)(\w*)(?=-lobby)/)[0] };
}));


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