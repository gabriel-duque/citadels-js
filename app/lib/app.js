import createServer from './server.js';
import Router from './router.js';
import { createLobby, createRouter } from './game-router.js';


export function init(GAME_ROOMS, SERVER_CONFIG) {


    const { app, io } = createServer(SERVER_CONFIG);
    

    app.get('/favicon.ico', (_, res) => res.status(204));


    app.use(Router.getPublicPath());

    app.get('/', Router.render("home", { games: Object.keys(GAME_ROOMS) }));


    for (const gameName in GAME_ROOMS) {

        createLobby(gameName, GAME_ROOMS[gameName], io);

        app.use(`/${gameName}`, createRouter(gameName));

        app.use(Router.getPublicPath(gameName));
    }


    app.use(Router.redirectAtRoot);
}