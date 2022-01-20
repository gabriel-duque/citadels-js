import Debug from '../debug.config.js';

export default class GameChildRoom {


  players = {};


  constructor(parentRoom, nameSpace) {

    this.parentRoom = parentRoom;

    this.nameSpace = parentRoom.io.of(nameSpace);

    this.session = parentRoom.io.session;
    

    this.debug = Debug(`room:${nameSpace.split('/')[1]}`);


    this.on = (message, callback) =>
      this.nameSpace
      .on(message, callback);

    this.emit = (message, data) =>
      this.nameSpace
      .emit(message, data);


    this.on('connection', socket => {

      this.debug(`New client connected at ${this.nameSpace.name}: ${socket.id}`);

      this.onConnection(socket);

      socket.on('disconnect', () => {

        this.debug(`Client disconnected from ${this.nameSpace.name}: ${socket.id}`);

        this.onDisconnection(socket);
      });
    });
  }


  onConnection() {

    throw new Error('On connection method not implemented');
  }


  onDisconnection() {

    throw new Error('On disconnection method not implemented');
  }


  get sockets() {

    return this.nameSpace.sockets;
  }

  register(socket, login) {

    this.players[socket.id] = login;

    this.debug(`Client registered at ${this.nameSpace.name}:`, login, socket.id);
  }

  /* Remove socket id from players */
  unRegister(socketId) {

    const login = this.players[socketId];

    if (!login) return; 

    delete this.players[socketId];

    this.debug(`Client unregistered from ${this.nameSpace.name}:`, login, socketId);
  }

  redirect(socket, path) {

    this.debug(`Redirecting ${socket.id} to ${path}`);

    socket.emit('redirect', path);
  }

  redirectAll(path) {

    this.emit('redirect', path);
  }


  /* Check if user is logged in */
  isUserLoggedIn(socket) {

    if (
      socket.request.session &&
      socket.request.session.logged &&
      socket.request.session.login
    ) {

      this.debug(`Client at ${this.nameSpace.name} is logged in: ${socket.id}`);

      return true;
    }

    this.debug(`Client at ${this.nameSpace.name} is not logged in: ${socket.id}`);
  }

  /* Check if game has started and is not finished */
  get isGameRunning() {

    if (this.parentRoom.isGameRunning()) {

      this.debug("A game is running");

      return true
    }

    this.debug("No game is running");
  }

}