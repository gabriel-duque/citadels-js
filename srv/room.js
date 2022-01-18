import Game from './game/game.js';

/* A class that binds a citadels game to socket connections */
export default class Room {

  players = {};

  sockets = {};

  constructor(io) {

    this.io = io;

    /* Bind lobby events to the lobby route */
    this.lobby = this.io.of("/lobby");

    this.lobby.on('connection', socket => this.lobbyConnection(socket));

    /* Bind game events to the game route */
    this.gameRoom = this.io.of("/game");

    this.gameRoom.on('connection', socket => this.gameConnection.bind(this)(socket));
  }

  /* Handle client connections on the lobby route */
  lobbyConnection(socket) {

    console.log("New lobby client connected", socket.id);

    /* If the user is already logged in */
    if (socket.request.session.logged) {

      if (this.game.hasStarted && !this.game.isOver) {

        /* if game is still running, redirect him to the game */
        console.log("User already logged in, redirecting to game");
        socket.emit('redirect', '/game');

        return;

      } else {

        /* If game is not running, remove login cookie */
        removeSession(socket);
      }
    }

    /* Send already connected players' login to incoming clients */
    this.sendLogins(socket);

    /* Send incoming players' login to already connected clients */
    socket.on('join_room', login => this.addPlayerToLobby(socket, login));

    /* Remove disconnected player from lobby and dispatch info to clients */
    socket.on('disconnect', () => this.disconnectPlayerFromLobby(socket));

    /*  When amount of desired players is reached */
    socket.on('room_complete', () => {

      /* Save login cookies */
      for (const login in this.players) {
        this.saveSession(login);
      }

      /* Starts the game and redirect clients */
      this.createGame();
    });
  }

  registerSocket(socket, login) {

    this.players[login] = socket.id;

    this.sockets[socket.id] = login;
  }


  unRegisterSocket(socket, login) {

    delete this.players[login];

    delete this.sockets[socket.id];
  }

  /* Store login data in cookie to bind lobby and game + survive disconnections */
  saveSession(login) {

    console.log("Saving session for", login);

    const socket = this.lobby.sockets.get(this.players[login]);

    socket.request.session.logged = true;
    socket.request.session.login = login;
    socket.request.session.save();
  }

  /* Remove login cookie */
  removeSession(socket) {

    console.log("Remove session data for: ", socket.request.session.login);
    socket.request.session.logged = false;
    socket.request.session.save();
  }

  /* Remove a player from the lobby */
  disconnectPlayerFromLobby(socket) {

    console.log("Lobby client disconnected", socket.id);

    const login = this.sockets[socket.id];

    if (!login) return;

    console.log("Removing player from lobby :", login);

    this.unRegisterSocket(socket, login);

    this.lobby.emit('player_left_lobby', login);
  }

  sendLogins(socket) {

    const logins = Object.keys(this.players);

    if (logins.length) {

      console.log("-----------------------------------------");
      socket.emit("player_joined", logins);
    }
  }

  /* Add a player to the lobby */
  addPlayerToLobby(socket, login) {

    /* make sure login is unique */
    if (this.players[login]) {
      socket.emit('login_taken');
      return;
    }

    /* remove previous player if same socket id */
    for (const prevLogin in this.players) {

      if (socket.id === this.players[prevLogin]) {

        console.log("Removing previous player", prevLogin);

        delete this.players[prevLogin];

        this.lobby.emit('player_left_lobby', prevLogin);
      }
    }

    /* store player login and socket id */
    this.registerSocket(socket, login);
    console.log("New player joined lobby :", login, socket.id);

    /* Inform clients that a player joined the lobby */
    this.lobby.emit('player_joined', [login]);
  }

  /* Handle client connections on the game route */
  gameConnection(socket) {

    console.log("New game client connected :", socket.id);

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

    const login = socket.request.session.login;

    this.registerSocket(socket, login);
    console.log("New player joined gameRoom :", login, socket.id);

    /* Send client it's own login */
    socket.emit("you_join_game", login);

    /* Send incoming players' login to already connected clients */
    socket.broadcast.emit("player_joined", [login]);

    /* Send already connected players' login to incoming clients */
    console.log("-----------------------------------------");
    this.sendLogins(socket);

    /* Dispatch disconnected player info to clients */
    socket.on('disconnect', () => this.game.emit('player_left_game', login));

    socket.on("start_loop", () => {
      console.log("Starting loop");

      this.game.loop();
    })

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

      for (const socket in this.sockets) {

        const login = this.sockets[socket];

        if (!login) continue;

        this.unRegisterSocket(socket, login);
      }
    });
  }
}