import './lobby.css';

import io from 'socket.io-client';

const gameName = document.querySelector('meta[name="game-name"]').content;

const socket = io(`/${gameName}-lobby`);

socket.on('redirect', path => {
  window.location = path;
});
 
// Try to log player
const joinRoomBtn = document.querySelector('.join-room');
const loginName = document.querySelector('.login-name');

joinRoomBtn.addEventListener('click', () => {

  if (!loginName.value.length) loginName.value = 'player' + Math.round(Math.random() * 100);

  socket.emit('player_log_attempt', loginName.value);
});

socket.on("login_taken", () => {

  alert("Login name taken");

  loginName.value = '';
})


// Test : starting game

const startGameBtn = document.querySelector('.start-game');

startGameBtn.addEventListener('click', () => {

  socket.emit("room_complete");
});


// Rendering lobby

const players = document.querySelector('.players');

socket.on("player_joined_lobby", logins => {

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