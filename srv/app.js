import { app, io } from './app/server.js';
import Router from './app/router.js';
import GameRooms from './games.js';
import GameRouter from './app/game-router.js';
import { v4 as uuid } from 'uuid';

import Debug from 'debug';
const debug = Debug('app:main');


app.use(Router.getPublicPath(''));


app.get("/", Router.render("home", { games: Object.keys(GameRooms) }));

const lobbies = {};

app.get(/\/\w+-lobbies/, Router.render("lobbies", url => {

  const [gameName] = url.match(/(?<=\/)(\w*)(?=-lobbies)/);

  return { gameName, lobbies: lobbies[gameName].lobbies };
}));


app.get(/\/\w+-lobby/, Router.render("lobby", url => {

  const [gameName] = url.match(/(?<=\/)(\w*)(?=-lobby)/);
  const [id] = url.match(/(?<=lobby\-)((\w|\-)*)/);

  return { gameName, id};
}));

app.post(/\/create-lobby\/\w+/, (req, res) => {

  const [gameName] = req.url.match(/(?<=create-lobby\/)(\w*)/);

  const lobbyId = lobbies[gameName].createLobby();

  res.send(JSON.stringify({ lobbyId }));
});


class GameLobbies {

  constructor(gameName) {

    debug(`Creating GameLobbies: ${gameName}`);
    this.name = gameName;
    this.lobbies = {};
  }

  createLobby() {

    debug(`Creating lobby for ${this.name}`);

    const lobbyId = uuid();

    this.lobbies[lobbyId] = new GameLobby(this.name, lobbyId);

    return lobbyId;
  }

  getLobby(lobbyId) {

    return this.lobbies[lobbyId];
  }

  deleteLobby(lobbyId) {

    delete this.lobbies[lobbyId];
  }
}

class GameLobby {

  open = true;
  players = [];

  constructor(gameName, lobbyId) {

    this.name = gameName;
    this.id = lobbyId;
  }
}


for (const gameName in GameRooms) {

  const gameRouter = new GameRouter(gameName, GameRooms[gameName], io);

  lobbies[gameName] = new GameLobbies(gameName);

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