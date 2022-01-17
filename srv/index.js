import Room from './room.js';

import {
  server,
  io
} from './server.js';

const room = new Room(io);
