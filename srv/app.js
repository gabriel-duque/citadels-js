import { app, io } from './app/server.js';
import Router from './app/router.js';
import GameRouter from './app/game-router.js';

import GameRooms from './games.js';


app.get('/favicon.ico', (req, res) => res.status(204));

app.use(Router.getPublicPath(''));

app.get('/', Router.render("home", { games: Object.keys(GameRooms) }));


for (const gameName in GameRooms) {

  app.use(`/${gameName}`, new GameRouter(gameName, GameRooms[gameName], io));

  app.use(Router.getPublicPath(gameName));
}


app.use(Router.redirectAtRoot);