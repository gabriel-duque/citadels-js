import GameChildRoom from './game-child-room.js';
import session from './session.js';

import Debug from '../debug.config.js';

const debug = Debug('lobby-room');

export default class GameLobbyRoom extends GameChildRoom {

  constructor(parentRoom, { nameSpace = '/lobby' } = {}) {

    super(parentRoom, nameSpace);
  }

  connect(socket) {

    debug("Lobby client connected:", socket.id);

    /* If user login is already stored in session */
    if (socket.request.session.logged) {

      if (this.parentRoom.isGameRunning()) {

        /* if game is still running, redirect him to the game */
        debug("User already logged in, redirecting to game");
        socket.emit('redirect', '/game');

        return;

      } else {

        /* If game is not running, remove login cookie */
        session.remove(socket);
      }
    }

    /* Send already connected players' login to incoming clients */
    socket.emit("player_joined_lobby", Object.values(this.players));

    /* Send incoming players' login to already connected clients */
    socket.on('player_log_attempt', login => this.logPlayer(socket, login));

    /* Remove disconnected player from lobby and dispatch info to clients */
    socket.on('disconnect', () => this.disconnect(socket));

    /*  When amount of desired players is reached */
    socket.on('room_complete', () => {

      /* Save login cookies */
      for (const [id, socket] of this.sockets) {
        session.save(socket, {
          logged: true,
          login: this.players[id]
        });
      }

      /* Starts the game and redirect clients */
      this.parentRoom.launchGame();

      this.emit('redirect', '/game');
    });
  }


  /* Add a player to the lobby */
  logPlayer(socket, login) {

    for (const socketId in this.players) {

      /* make sure login is unique */
      if (this.players[socketId] === login) {
        socket.emit('login_taken');
        return;
      }

      /* make sure socket.id is unique (if player changes name) */
      if (socketId === socket.id) {
        debug("Player left lobby :", this.players[socketId], socketId);
        this.emit('player_left_lobby', this.players[socketId]);
        delete this.players[socketId];
      }
    }

    /* Bind socket id with player login */
    this.players[socket.id] = login;
    debug("Player joined lobby :", login, socket.id);

    /* Inform clients that a player joined the lobby */
    this.emit('player_joined_lobby', [login]);
  }

  /* Remove a player from the lobby */
  disconnect(socket) {

    debug("Lobby client disconnected", socket.id);

    const login = this.players[socket.id];

    if (!login) return;

    delete this.players[socket.id];
    debug("Removing player from lobby :", login);
    this.emit('player_left_lobby', login);
  }
}