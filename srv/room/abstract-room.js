export default class AbstractRoom {

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

      console.log("Saving session for", login);

      socket.request.session.logged = true;

      socket.request.session.login = login;

      socket.request.session.save();
    },

    remove(socket) {

      console.log("Remove session data for: ", socket.request.session.login);

      socket.request.session.logged = false;

      delete socket.request.session.login;

      socket.request.session.save();
    }
  }
}