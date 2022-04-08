import './citadels.css';

import { socket } from "app/connection";

import events from 'app/event-emmitter';

import Game from 'app/game';

/*
TESTING start game
*/
const startGameBtn = document.querySelector('.start-game');
startGameBtn.addEventListener('click', () => {
  socket.emit('start_loop');
});
/* --------- */


events.on('initial_game_state', state => {

  console.log("Initial game state:", state);

  const game = new Game(state);

});

