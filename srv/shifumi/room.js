import GameRoom from '../server/game-room.js';

import Debug from '../debug.config.js';
const debug = Debug('citadels:room');

class ShifumiGame {

    constructor() {
        
    }
}


export default class ShifumiRoom extends GameRoom {

  constructor(io) {

    super(io, ShifumiGame, ShifumiRoom.routes);
  }


  isGameRunning() {

    return this.game && this.game.hasStarted && !this.game.isOver
  }


  onHandshakeDone(socket) {

  }


  getInitialPrivateGameState(socket) {
  }

  getInitialPublicGameState() {
  }
  
  bindEvents() {
  }

}