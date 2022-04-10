import './citadels.css';

import { socket } from "app/connection";

import events from 'app/event-emmitter';

import Game from 'app/game';


events.on('initial_game_state', init);

function init(state) {

  console.log("Initial game state:", state);

  const game = new Game(state);
}