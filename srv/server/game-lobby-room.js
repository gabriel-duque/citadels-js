import GameChildRoom from './game-child-room.js';
import session from './session.js';


export default class GameLobbyRoom extends GameChildRoom {


  constructor(parentRoom, ioNamespace) {

    super(parentRoom, ioNamespace);
  }

  onConnection(socket) {

    /* Chek if player login is already stored in session */
    if (this.checkExistingSession(socket)) return;

    /* Send already connected clients login to incoming one */
    socket.emit("player_joined_lobby", Object.values(this.players));

    /* Send incoming client login to connected ones */
    socket.on('player_log_attempt', login => this.register(socket, login));

    /*  Launch game when amount of desired players is reached */
    socket.on('room_complete', () => {

      /* Save login cookies */
      this.saveLoginsInCookie();

      /* Starts the game */
      this.parentRoom.launchGame();

      /* Redirects all players to the game */
      this.redirectAll(this.parentRoom.playPath);
    });
  }


  /* Remove a player from the lobby */
  onDisconnection(socket) {

    this.unRegister(socket.id);
  }


  /* Save login in cookies */
  saveLoginsInCookie() {

    for (const [id, socket] of this.sockets) {

      session.save(socket, {
        logged: true,
        login: this.players[id]
      });
    }
  }


  /* Add a player to the lobby */
  register(socket, login) {

    /* Make sure logins and sockets ids are unique */
    for (const socketId in this.players) {

      if (this.players[socketId] === login) {

        /* Prevent user from using someone else's login */
        if (socketId !== socket.id) {
          socket.emit('login_taken');
        }

        /* Do nothing if same player used same name */
        return;
      }

      /* Handle player changing name */
      if (socketId === socket.id) {
        this.unRegister(socketId);
      }
    }

    super.register(socket, login);

    /* Inform clients that a player joined the lobby */
    this.emit('player_joined_lobby', [login]);
  }


  /* Unregister player and inform other clients */
  unRegister(socketId) {

    if (!this.players[socketId]) return;

    this.emit('player_left_lobby', this.players[socketId]);

    super.unRegister(socketId);
  }


  /* Handle existing session */
  checkExistingSession(socket) {

    if (!this.isUserLoggedIn(socket)) return;

    if (this.isGameRunning) {

      /* If game is still running, redirect him to the game */
      this.redirect(socket, this.parentRoom.playPath);

      return true
    }

    /* If game is not running, remove unwanted login cookie */
    session.remove(socket);
  }


}