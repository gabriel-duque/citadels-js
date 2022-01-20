import http from 'http';
import express from 'express';
import { Server } from "socket.io";

import { port } from '../server.config.js';
import { cookieParser, session, sessionMiddleware } from './session-store.js';

import Debug from '../debug.config.js';
const debug = Debug('server');


export const app = express();

const httpServer = http.createServer(app);

export const io = new Server(httpServer);

io.initNamespace = function(name) {

  if (!io._nsps.has(name)) {

    debug(`Initializing namespace: ${name}`);

    io.of(name)
      .use((socket, next) =>
        sessionMiddleware(socket, {}, next)
      );
  }
}

httpServer.listen(port, () => debug(`Server listening on port ${port}`));

app.use(cookieParser);

app.use(session);