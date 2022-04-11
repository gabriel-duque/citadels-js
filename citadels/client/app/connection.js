import io from 'socket.io-client';

export const socket = io("/citadels");

/*
TESTING start game
*/
const startGameBtn = document.querySelector('.start-game');
startGameBtn.addEventListener('click', () => {
  socket.emit('start_loop');
});
/* --------- */

socket.on('redirect', path => {
  window.location = path;
});
