import AbstractRoom from './abstract-room.js';

export default class PlayRoom extends AbstractRoom {

  constructor(io, room) {

    super(io, '/game');

    this.isGameRunning = room.isGameRunning.bind(room);
    this.onHandshakeDone = room.onHandshakeDone.bind(room);

    this.on('connection', socket => this.connect(socket));
  }

  connect(socket) {

    console.log("New game client connected:", socket.id);

    /* If there is no game running, make sure there is no log cookie */
    if (!this.isGameRunning()) {
      console.log("No game running, remove login cookie");
      this.session.remove(socket);
    }

    /* If user is not logged in, redirects player back to lobby */
    if (!socket.request.session.logged || !socket.request.session.login) {
      console.log("User not logged in, redirecting to lobby");
      socket.emit('redirect', '/');
      return;
    }

    const login = socket.request.session.login;

    /* make sure login is unique (if player refreshes) */
    for (const socketId in this.players) {
      if (this.players[socketId] === login) {
        console.log("Player left playRoom:", login, socketId);
        delete this.players[socketId];
      }
    }

    /* Bind socket id with player login */
    this.players[socket.id] = login;

    console.log("Player joined playRoom:", login, socket.id);

    ///////////////////////////////////

    /* Send client it's own login */
    socket.emit("you_join_game", login);

    /* Send incoming players' login to already connected clients */
    socket.broadcast.emit("player_joined", [login]);

    /* Send already connected players' login to incoming clients */
    socket.emit("player_joined", Object.values(this.players));

    ///////////////////////////////////

    /* Dispatch disconnected player info to clients */
    socket.on('disconnect', () => this.disconnect(login));

    this.onHandshakeDone(socket)
  }

  disconnect(login) {
    this.emit('player_left_game', login)
  }
}