import path from 'path';
import http from 'http';
import express from 'express';
import { Server } from "socket.io";

import Debug from '../test/debug.js';
import setSession from './session.js';
import { port } from '../config.js';

const debug = Debug('server');

const app = express();

const server = http.createServer(app);

const io = new Server(server);

setSession(app, io);

server.listen(port, () => {
  debug(`Server listening on port ${port}`);
});

// Handle routes
app.use(express.static(path.resolve('../dist/')));

app.get("/", (_, res) => {
  res.sendFile(path.resolve("../dist/lobby.html"))
});

app.get("/game", (_, res) => {
  res.sendFile(path.resolve("../dist/game.html"))
});

export {
  io,
  server
};