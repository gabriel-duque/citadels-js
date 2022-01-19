import GameLobbyRoom from './game-lobby-room.js';
import GamePlayRoom from './game-play-room.js';

import Debug from '../debug.config.js';

const debug = Debug('room');

export default class Room {


  constructor(io, Game) {

    debug("\r\nCreating new room of game:", Game.name);

    this.io = io;

    this.Game = Game;

    this.lobbyRoom = new GameLobbyRoom(this, { nameSpace: '/lobby' });
    this.playRoom = new GamePlayRoom(this, { nameSpace: '/game' });
  }


  launchGame() {

    debug("Creating new game of:", this.Game.name);

    this.players = Object.values(this.lobbyRoom.players);

    this.game = new this.Game(this.players);

    this.publicGameState = this.getInitialPublicGameState();

    this.bindEvents();
  }


  isGameRunning() {
    throw new Error("Method not implemented.");
  }


  onHandshakeDone(socket) {
    throw new Error("Method not implemented.");
  }


  /* returns the game state that can be shared publicly */
  getInitialPublicGameState() {
    throw new Error("Method not implemented.");
  }


  /* returns the game state only seen by specific player */
  getInitialPrivateGameState(socket) {
    throw new Error("Method not implemented.");
  }

  
  /* Bind server game events to client connections */
  bindEvents() {
    throw new Error("Method not implemented.");
  }

}