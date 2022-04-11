import './citadels.css';

import { socket } from "app/connection";

import Game from 'app/game';

socket.on('initial_game_state', init);

function init(state) {

  console.log("Initial game state:", state);

  const game = new Game(state);
}