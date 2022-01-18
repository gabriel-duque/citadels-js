import Room from './room/room.js';
import { io } from './server/server.js';

const room = new Room(io);