import Debug from '../test/debug.js';

export default class ChildRoom {

  players = {};

  constructor(io, routeName) {

    this.io = io;

    this.nameSpace = io.of(routeName);

    this.on = (message, callback) =>
      this.nameSpace
      .on(message, callback);

    this.emit = (message, data) =>
      this.nameSpace
      .emit(message, data);
  }

  get sockets() {
    return this.nameSpace.sockets;
  }

  session = {

    save(socket, login) {

      Debug("session")("Saving session for:", login);

      socket.request.session.logged = true;

      socket.request.session.login = login;

      socket.request.session.save();
    },

    remove(socket) {

      Debug("session")("Remove session data for: ", socket.request.session.login);

      socket.request.session.logged = false;

      delete socket.request.session.login;

      socket.request.session.save();
    }
  }
}