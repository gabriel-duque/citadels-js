import { v4 as uuid } from 'uuid';

import Debug from 'debug';
const debug = Debug('app:game-lobby');


export default class GameLobby {


  rooms = {};


  constructor(gameName, GameRoom, io) {

    debug(`Creating lobby for game: ${gameName}`);

    this.name = gameName;

    this.GameRoom = GameRoom;

    io.initNamespace(`/${gameName}`);

    this.io = io.of(`/${gameName}`);

  }


  createRoom() {

    debug(`Creating new room of game: ${this.name}`);

    const roomId = uuid();

    this.rooms[roomId] = new this.GameRoom(this.io, roomId);;

    return roomId;
  }

}