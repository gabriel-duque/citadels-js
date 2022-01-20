import { app, io } from './server/server.js';
import Router from './server/router.js';

import GameRooms from './games.js';
import GameRouter from './server/game-router.js';


app.get('/', Router.askForFile('home'));

app.use(Router.getPublicPath('home'));


for (const gameName in GameRooms) {

  const GameRoom = GameRooms[gameName];

  const gameRouter = new GameRouter(gameName, GameRoom, io);

  app.get(`/${gameName}`,
    gameRouter.createRoomIfNotExists.bind(gameRouter),
    gameRouter.redirectToLobby.bind(gameRouter)
  );

  for (const route of Object.values(GameRoom.routes)) {

    io.initNamespace(route.ioNamespace);

    app.get(route.publicPath,
      gameRouter.makeSureRoomExists.bind(gameRouter),
      Router.askForFile(route.fileName));
  }

  app.use(Router.getPublicPath(gameName));
}

app.use(Router.redirectAtRoot);