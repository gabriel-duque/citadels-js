import express from 'express';
import http from 'http';
import {
  Server
} from "socket.io";

import setSession from './session.js';

import path from 'path';

const port = process.env.PORT || 3000;
// const port = typeof(PhusionPassenger) !== 'undefined' ?'passenger' : 3000;

const app = express();

const server = http.createServer(app);

const io = new Server(server);

setSession(app, io);

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

// Handle routes
app.use(express.static(path.resolve('src/')));

app.get("/", (_, res) => {
  res.sendFile(path.resolve("src/lobby.html"))
});

app.get("/game", (_, res) => {
  res.sendFile(path.resolve("src/game.html"))
});

export {
  io,
  server
};