import GameLobbyRoom from './game-lobby-room.js';
import GamePlayRoom from './game-play-room.js';

import Debug from 'debug';
const debug = Debug('app:game-room');

export default class GameRoom {


  constructor(io, id, Game) {

    this.io = io;

    this.id = id;
    
    this.Game = Game;

    this.session = io.session;

    this.lobbyRoom = new GameLobbyRoom(this, id);
    this.playRoom = new GamePlayRoom(this, id);

    this.lobbyPath = `/${Game.name}/${this.id}`;
    this.playPath = `/${Game.name}/${this.id}/play`;
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


  onHandshakeDone() {
    throw new Error("onHandshakeDone Method not implemented.");
  }


  /* returns the game state that can be shared publicly */
  getInitialPublicGameState() {
    throw new Error("getInitialPublicGameState Method not implemented.");
  }


  /* returns the game state only seen by specific player */
  getInitialPrivateGameState() {
    throw new Error("getInitialPrivateGameState Method not implemented.");
  }

  
  /* Bind server game events to client connections */
  bindEvents() {
    throw new Error("bindEvents Method not implemented.");
  }

}