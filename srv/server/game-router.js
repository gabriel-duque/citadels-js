import Debug from '../debug.config.js';

import { serverConfig } from '../../routes.config.js';

export default class GameRouter {

  static rooms = {};

  constructor(gameName, GameRoom, io) {

    this.io = io;

    this.name = gameName;

    this.GameRoom = GameRoom;

    this.GameRoom.routes = serverConfig(gameName).routes;

  }

  get room() {
    return GameRouter.rooms[this.name];
  }

  set room(room) {
    GameRouter.rooms[this.name] = room;
  }

  /* Create room if it doesn't exists */
  createRoomIfNotExists(_, __, next) {

    if (!this.room) {

      this.room = new this.GameRoom(this.io);

      Debug(`router:${this.name}`)(`Created room of ${this.name}`);
    }

    next();
  }

  /* Redirect to game lobby */
  redirectToLobby(req, res) {

    const lobbyPath = this.GameRoom.routes.lobby.publicPath;

    res.redirect(lobbyPath);

    Debug(`router:${this.name}`)(`Redirect ${req.url} to ${lobbyPath}`);
  }

  /* handle get request at route /${gameName}-${nameSpace} */
  makeSureRoomExists(_, res, next) {

    if (!this.room) {

      Debug(`router:${this.name}`)(`No ${this.name} game room found, redirecting`);

      res.redirect('/');

      return;
    }

    next();
  }
}