import './citadels.css';


import io from 'socket.io-client';


import Players from 'app/players';

import Characters from 'app/characters';

import Console from 'app/console';

import Modal from 'app/modal';

import bindEvents from 'app/events';


const socket = io("/citadels");


socket.on('initial_game_state', init);

function init({ characters, player, logins }) {

  const game = {

    logins,

    characters: Characters.init(characters),

    console: Console.init(),

    modal: new Modal(),

    players: Players.init(player, logins)
  }

  bindEvents(socket, game);
}


socket.on('redirect', path => window.location = path);


/* TESTING start game */
document.querySelector('.start-game').addEventListener('click', () => socket.emit('start_loop'));
