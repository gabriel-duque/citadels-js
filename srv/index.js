import gameServer from './server/server.js';
import Room from './server/citadels-room.js';

gameServer.routes = [{
  publicPath: '/',
  fileName: 'lobby.html',
  ioNamespace: '/lobby',
}, {
  publicPath: '/game',
  fileName: 'game.html',
  ioNamespace: '/game',
}];

const room = new Room(gameServer.io);