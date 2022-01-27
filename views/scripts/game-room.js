import io from 'socket.io-client';

const gameName = document.querySelector('meta[name="game-name"]')
  .content;

const socket = io(`/${gameName}`);


socket.on('redirect', path => {
  window.location = path;
});


/* Try to log player */
const joinRoomBtn = document.querySelector('.join-room');
const loginName = document.querySelector('.login-name');

joinRoomBtn.addEventListener('click', () => {

  if (!loginName.value.length) {

    loginName.value = getRandomName();
  }

  socket.emit('log_attempt', loginName.value);
});

function getRandomName() {

  return 'player' + Math.round(Math.random() * 100);
}

socket.on("login_taken", () => {

  alert("Login name taken");

  loginName.value = '';
})


/* Test : starting game */

const readyStateBtn = document.querySelector('.toggle-readystate');

let ready = false;

readyStateBtn.addEventListener('click', () => {

  ready = !ready;

  socket.emit("toggle_ready_state", ready);

  socket.emit("room_complete");
});

const players = document.querySelector('.players');

socket.on("toggle_ready_state", ({ login, ready }) => {

  const player = players.querySelector(`[data-login=${login}]`);

  player.className = "lobby player" + (ready ? " ready" : "");
})

/* Rendering lobby */


socket.on("player_joined", logins => {

  for (const login of logins) {

    const player = document.createElement('div');

    player.className = 'lobby player';

    player.setAttribute("data-login", login);

    player.innerHTML = login;

    players.appendChild(player);
  }

});

socket.on("player_left", login => {

  const player = document.querySelector(`[data-login="${login}"]`);

  players.removeChild(player);
});