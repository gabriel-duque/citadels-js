import 'styles/global.css';
import 'styles/game.css';


import io from 'socket.io-client';
 
const socket = io("/game");

socket.on('redirect', path => {
  window.location = path;
});

socket.on("initial_game_state", state => {
 console.log("Initial game state:", state);
})


/// TESTING start game
const button = document.createElement('button');
button.innerHTML = "Start game";
button.addEventListener('click', () => {
  socket.emit('start_loop');
});
document.body.appendChild(button);