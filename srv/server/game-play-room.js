import GameChildRoom from './game-child-room.js';

export default class GamePlayRoom extends GameChildRoom {


  constructor(parentRoom, ioNamespace) {

    super(parentRoom, ioNamespace);
  }


  onConnection(socket) {

    /* If no game is running, log player out */
    if (!this.isGameRunning) {

      this.session.remove(socket);
    }

    /* If user is not logged in, redirects to lobby */
    if (!this.isUserLoggedIn(socket)) {

      this.redirect(socket, this.parentRoom.lobbyPath);

      return;
    }

    /* Bind socket id with player login */
    this.register(socket, socket.request.session.login);

    /* This player is ready to playi*/
    this.parentRoom.onHandshakeDone(socket)
  }

  /* Inform players that someone left, do not unregister player as he might reconnect */
  onDisconnection(socket) {

    this.nameSpace.to(this.nameSpace.name)
      .emit('player_left_game', socket.id);
  }


  /* Bind socket id with player login */
  register(socket, login) {

    /* make sure login is unique (eg. if player refreshes) */
    this.makeSureLoginIsUnique(login);

    super.register(socket, login);
  }


  makeSureLoginIsUnique(login) {

    for (const socketId in this.players) {

      if (this.players[socketId] === login) {

        this.unRegister(socketId);
      }
    }
  }

}