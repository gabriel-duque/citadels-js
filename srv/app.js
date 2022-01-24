import { app, io } from './app/server.js';
import Router from './app/router.js';
import GameRouter from './app/game-router.js';

import GAME_ROOMS from './games.js';


app.get('/favicon.ico', (req, res) => res.status(204));

app.use(Router.getPublicPath(''));

app.get('/', Router.render("home", { games: Object.keys(GAME_ROOMS) }));


for (const gameName in GAME_ROOMS) {

  app.use(`/${gameName}`, new GameRouter(gameName, GAME_ROOMS[gameName], io));

  app.use(Router.getPublicPath(gameName));
}


app.use(Router.redirectAtRoot);