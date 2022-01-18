import Room from './room/room.js';

import {
  server,
  io
} from './server/server.js';

const room = new Room(io);
