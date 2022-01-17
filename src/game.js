// import io from 'socket.io-client';

import {
  io
} from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("/game");

socket.on('join_game', login => {
  console.log(login);
});

socket.on('redirect', path => {
  window.location = path;
});

const button = document.createElement('button');

button.addEventListener('click', () => {
  socket.emit('start_loop');
});

document.body.appendChild(button);