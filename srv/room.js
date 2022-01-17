import Game from './game/game.js';

/* A class that binds a citadels game to socket connections */
export default class Room {

  players = {};

  sockets = {};

  sessions = {};

  constructor(io) {

    this.io = io;

    /* Bind lobby events to the lobby route */
    this.lobby = this.io.of("/lobby");

    this.lobby.on('connection', socket => this.lobbySocketConnection(socket));

    /* Bind game events to the game route */
    this.gameRoom = this.io.of("/game");

    this.gameRoom.on('connection', socket => this.gameSocketConnection.bind(this)(socket));
  }

  /* Handle client connections on the lobby route */
  lobbySocketConnection(socket) {

    console.log("New lobby client connected", this.sockets[socket.id]);

    /* If the user is already logged in */
    if (socket.request.session.logged) {

      if (this.game.hasStarted && !this.game.isOver) {

        console.log("User already logged in, redirecting to game");

        /* if game is still running, redirect him to the game */
        socket.emit('redirect', '/game');

        return;

      } else {

        console.log("Remove session data");

        /* if game is not running, remove log cookie */
        socket.request.session.logged = false;
        socket.request.session.save();
      }
    }

    /* send already connected players' login to incoming clients */
    const logins = Object.keys(this.players);

    if (logins.length) {

      socket.emit("player_join", logins);
    }

    /* send incoming players' login to already connected clients */
    socket.on('join_room', login => this.addPlayer(socket, login));

    /* Remove disconnected player from lobby and dispatch info to clients */
    socket.on('disconnect', () => {

      const login = this.sockets[socket.id];

      delete this.players[login];

      delete this.sockets[socket.id];

      console.log("Disconnected player :", login);

      this.lobby.emit('player_left', login);
    });

    /* Save log cookies, starts the game and redirect clients
       when amount of desired players is reached */
    socket.on('room_complete', () => {
      this.saveSessions();
      this.createGame();
    });
  }

  /* Handle client connections on the game route */
  gameSocketConnection(socket) {

    console.log("New game client connected", this.sockets[socket.id]);

    /* If there is no game running, remove log cookie */
    if (
      !this.game ||
      !this.game.hasStarted ||
      this.game.isOver
    ) {
      console.log("No game running, redirecting to lobby");

      socket.request.session.logged = false;
      socket.request.session.save();
    }

    /* If user is not logged in, redirects player back to lobby */
    if (!socket.request.session.logged) {

      console.log("User not logged in, redirecting to lobby");

      socket.emit('redirect', '/');

      return;
    }

    /* Send each clients the players logins */
    socket.emit("join_game", socket.request.session.login);

    socket.on("start_loop", () => {
      console.log("Starting loop");

      this.game.loop();
    })

  }

  /* Add a player to the lobby */
  addPlayer(socket, login) {

    /* make sure login is unique */
    if (this.players[login]) {
      socket.emit('login_taken');
      return;
    }

    /* remove previous player if same socket id */
    for (const prevLogin in this.players) {

      const socketId = this.players[prevLogin];

      if (socket.id === socketId) {

        delete this.players[prevLogin];

        this.lobby.emit('player_left_lobby', prevLogin);
      }
    }

    /* store player login and socket id */

    this.players[login] = socket.id;

    this.sockets[socket.id] = login;


    /* Inform clients that a player joined the lobby */

    this.lobby.emit('player_joined_lobby', [login]);

    console.log("New player:", login, socket.id);
  }

  saveSessions() {

    /* Store login data in cookie to bind lobby and game + survive disconnections */

    for (const login in this.players) {

      console.log("Saving session for", login);

      const socketId = this.players[login];

      const socket = this.lobby.sockets.get(socketId);

      socket.request.session.logged = true;
      socket.request.session.login = login;
      socket.request.session.save();

      this.sessions[socket.request.sessionId] = login;
    }
  }

  /* Create our game */
  createGame() {

    console.log("Creating new game");

    this.game = new Game(this.players);

    this.bindEvents();

    this.lobby.emit('start_game');
  }

  /* Bind server game events to client connections */
  bindEvents() {

    this.game.on('turn', (turn) => {
      this.gameRoom.emit('turn', turn);
    });

    this.game.on('player_left', (player) => {
      this.gameRoom.emit('player_left', player);
    });

    this.game.on('player_turn', (player) => {
      this.gameRoom.emit('player_turn', player);
    });

    this.game.on('player_end_turn', (player) => {
      this.gameRoom.emit('player_end_turn', player);
    });

    this.game.on('player_draws_card', (player) => {
      this.gameRoom.emit('player_discard_card', player);
    });

    this.game.on('player_discards_card', (player) => {
      this.gameRoom.emit('player_discards_card', player);
    });

    this.game.on('player_builds_district', (player) => {
      this.gameRoom.emit('player_builds_district', player);
    });

    this.game.on('player_steals_gold', (player) => {
      this.gameRoom.emit('player_steals_gold', player);
    });

    this.game.on('player_attacks_district', (player) => {
      this.gameRoom.emit('player_steals_gold', player);
    });

    this.game.on('player_is_new_first_to_play', (player) => {
      this.gameRoom.emit('player_is_new_first_to_play', player);
    });

    this.game.on('player_exchange_cards_with_deck', (player) => {
      this.gameRoom.emit('player_exchange_cards_with_deck', player);
    });

    this.game.on('player_exchange_cards_with_player', (player) => {
      this.gameRoom.emit('player_exchange_cards_with_player', player);
    });

    this.game.on('game_finished', (scores) => {
      this.gameRoom.emit('game_finished', scores);
      console.log(scores, '\n');
    });
  }
}