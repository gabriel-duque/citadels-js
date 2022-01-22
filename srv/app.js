import { app, io } from './app/server.js';
import Router from './app/router.js';
import GameRooms from './games.js';
import GameRouter from './app/game-router.js';
import { v4 as uuid } from 'uuid';

import Debug from 'debug';
const debug = Debug('app:main');


app.use(Router.getPublicPath(''));


app.get("/", Router.render("home", { games: Object.keys(GameRooms) }));


app.get(/\/\w+-lobbies/, Router.render("lobbies", url => {

  return { gameName: url.match(/(?<=\/)(\w*)(?=-lobbies)/)[0] };
}));

const lobbies = {};


app.get(/\/\w+-lobby/, Router.render("lobby", url => {

  return { gameName: url.match(/(?<=\/)(\w*)(?=-lobby)/)[0] };
}));


app.post("/lobbies", (req, res) => {
  const lobbyId = uuid();
  debug('lobby created', lobbyId);
  lobbies[lobbyId] = {}
  res.send(JSON.stringify({ lobbyId }));
});


for (const gameName in GameRooms) {

  const gameRouter = new GameRouter(gameName, GameRooms[gameName], io);

  app.get(`/${gameName}`,
    gameRouter.createRoomIfNotExists.bind(gameRouter),
    gameRouter.redirectToLobby.bind(gameRouter) // here redirect to new page $ {game}-lobbies
  );

  io.initNamespace(`/${gameName}`);

  app.get(`/${gameName}-play`,
    gameRouter.makeSureRoomExists.bind(gameRouter),
    Router.askForFile(`/${gameName}-play`));

  app.use(Router.getPublicPath(gameName));
}

app.use(Router.redirectAtRoot);