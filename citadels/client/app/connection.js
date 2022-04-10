import io from 'socket.io-client';
import events from 'app/event-emmitter';

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


socket.on("initial_game_state", state => {

  events.emit("initial_game_state", state);
});


socket.on("message", message => {
  events.emit("console", message)
});


socket.on("chose_character", remaining_characters => {

  // const character = Math.floor(Math.random() * remaining_characters.length);

  events.emit("reveal_remaining_characters", remaining_characters);

  events.on("chose_character", character => {

    socket.emit("chose_character", character);

    events.removeAllListeners("chose_character");
  });
});


socket.on("coin_or_gold", () => {

  events.emit("coin_or_gold");

  events.on("chose_coin_or_gold", coin_or_gold => {

    socket.emit("coin_or_gold", coin_or_gold);

    events.removeAllListeners("coin_or_gold");
  });
});


socket.on("update_player_coins", (login, amount) => {
  
    events.emit("update_player_coin", login, amount);
});


socket.on("build_district", () => {

    events.emit("build_district");

    events.on("chose_district", district => {
      
      socket.emit("build_district", district);
    });
})