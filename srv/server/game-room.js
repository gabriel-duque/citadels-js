import GameLobbyRoom from './game-lobby-room.js';
import GamePlayRoom from './game-play-room.js';

import Debug from '../debug.config.js';

const debug = Debug('game-room');

export default class GameRoom {


  constructor(io, Game, routes) {

    debug("\r\nCreating new room of game:", Game.name);

    this.io = io;
    this.Game = Game;
    this.routes = routes;

    this.lobbyRoom = new GameLobbyRoom(this, routes.lobby.ioNamespace);
    this.playRoom = new GamePlayRoom(this, routes.play.ioNamespace);

    this.lobbyPath = routes.lobby.publicPath;
    this.playPath = routes.play.publicPath;
  }


  launchGame() {

    debug("Creating new game of:", this.Game.name);

    this.players = Object.values(this.lobbyRoom.players);

    this.game = new this.Game(this.players);

    this.publicGameState = this.getInitialPublicGameState();

    this.bindEvents();
  }


  isGameRunning() {
    throw new Error("isGameRunning Method not implemented.");
  }


  onHandshakeDone(socket) {
    throw new Error("onHandshakeDone Method not implemented.");
  }


  /* returns the game state that can be shared publicly */
  getInitialPublicGameState() {
    throw new Error("getInitialPublicGameState Method not implemented.");
  }


  /* returns the game state only seen by specific player */
  getInitialPrivateGameState(socket) {
    throw new Error("getInitialPrivateGameState Method not implemented.");
  }

  
  /* Bind server game events to client connections */
  bindEvents() {
    throw new Error("bindEvents Method not implemented.");
  }

}