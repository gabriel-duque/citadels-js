import GameLobbyRoom from './game-lobby-room.js';
import GamePlayRoom from './game-play-room.js';

import Debug from '../debug.config.js';


export default class GameRoom {


  constructor(io, Game) {

    this.io = io.of(Game.name);

    this.session = io.session;
    
    this.Game = Game;

    this.debug = Debug(`room:${this.Game.name}`);

    this.debug("\r\nCreating new room of game:", Game.name);

    this.lobbyRoom = new GameLobbyRoom(this);
    this.playRoom = new GamePlayRoom(this);

    this.lobbyPath = `/${Game.name}-lobby`;
    this.playPath = `/${Game.name}-play`;
  }


  launchGame() {

    this.debug("Creating new game of:", this.Game.name);

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