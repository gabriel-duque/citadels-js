import http from 'http';
import express from 'express';
import { Server } from "socket.io";

import { port } from '../server.config.js';
import { cookieParser, expressSessionStore, sessionMiddleware } from './session-store.js';
import socketSession from './socket-session.js';

import Debug from '../debug.config.js';
const debug = Debug('server');


export const app = express();

app.set('view engine', 'ejs');

app.use(cookieParser);

app.use(expressSessionStore);


const httpServer = http.createServer(app);

httpServer.listen(port, () => debug(`Server listening on port ${port}`));


export const io = new Server(httpServer);

io.session = socketSession;

io.initNamespace = function(name) {

  if (!this._nsps.has(name)) {

    debug(`Initializing namespace: ${name}`);

    this.of(name)
      .use((socket, next) =>
        sessionMiddleware(socket, {}, next)
      );
  }
};