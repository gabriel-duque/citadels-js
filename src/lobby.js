import {
  io
} from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
// import io from 'socket.io-client';

const socket = io("/lobby");

const loginName = document.querySelector('.login-name');
const players = document.querySelector('.players');

document.querySelector('.join-room')
  .addEventListener('click', () => {

    if (!loginName.value.length) loginName.value = 'player' + Math.round(Math.random() * 100);

    socket.emit('join_room', loginName.value);
  });

document.querySelector('.start-game')
  .addEventListener('click', () => {

    socket.emit("room_complete");
  });

socket.on("login_taken", () => {

  alert("Login name taken");

  loginName.value = '';
})

socket.on("player_joined", logins => {

  for (const login of logins) {

    const player = document.createElement('div');

    player.setAttribute("data-login", login);

    player.innerHTML = login;

    players.appendChild(player);
  }

});

socket.on("player_left_lobby", login => {

  const player = document.querySelector(`[data-login="${login}"]`);

  players.removeChild(player);
});

socket.on('start_game', () => {
  window.location = "./game";
});

socket.on('redirect', path => {
  window.location = path;
});