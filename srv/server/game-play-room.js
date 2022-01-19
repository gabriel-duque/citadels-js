import GameChildRoom from './game-child-room.js';
import session from './session.js';

import Debug from '../debug.config.js';

const debug = Debug('play-room');

export default class GamePlayRoom extends GameChildRoom {


  constructor(parentRoom, { nameSpace = '/game' } = {}) {

    super(parentRoom, nameSpace);
  }


  connect(socket) {

    debug("New game client connected:", socket.id);

    /* If there is no game running, make sure there is no log cookie */
    if (!this.parentRoom.isGameRunning()) {
      debug("No game running, remove login cookie");
      session.remove(socket);
    }

    /* If user is not logged in, redirects player back to lobby */
    if (!socket.request.session.logged || !socket.request.session.login) {
      debug("User not logged in, redirecting to lobby");
      socket.emit('redirect', '/');
      return;
    }

    const login = socket.request.session.login;

    /* make sure login is unique (if player refreshes) */
    for (const socketId in this.players) {
      if (this.players[socketId] === login) {
        debug("Player left playRoom:", login, socketId);
        delete this.players[socketId];
      }
    }

    /* Bind socket id with player login */
    this.players[socket.id] = login;
    debug("Player joined playRoom:", login, socket.id);

    /* Dispatch disconnected player info to clients */
    socket.on('disconnect', () => this.disconnect(login));

    this.parentRoom.onHandshakeDone(socket)
  }


  disconnect(login) {

    this.emit('player_left_game', login)
  }

}