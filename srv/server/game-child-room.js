import Debug from '../debug.config.js';

export default class GameChildRoom {


  players = {};


  constructor(parentRoom, nameSpace) {

    this.parentRoom = parentRoom;

    this.nameSpace = parentRoom.io.of(nameSpace);

    this.on = (message, callback) =>
      this.nameSpace
      .on(message, callback);

    this.emit = (message, data) =>
      this.nameSpace
      .emit(message, data);

    this.on('connection', socket => this.connect(socket));
  }


  get sockets() {
    return this.nameSpace.sockets;
  }


  connect() {
    throw new Error('On connect method not implemented');
  }


  disconnect() {
    throw new Error('On disconnect method not implemented');
  }
  
}