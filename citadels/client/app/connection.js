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

socket.on("new_turn", firstPlayer => {
  events.emit("new_turn", firstPlayer)
});


socket.on("chose_character", remaining_characters => {

  // const character = Math.floor(Math.random() * remaining_characters.length);

  events.emit("reveal_remaining_characters", remaining_characters);

  events.on("chose_character", character => {

    socket.emit("chose_character", character);

    events.removeAllListeners("chose_character");
  });
});


socket.on("card_or_coin", () => {

  events.emit("card_or_coin");

  events.on("chose_card_or_coin", card_or_coin => {

    socket.emit("card_or_coin", card_or_coin);

    events.removeAllListeners("card_or_coin");
  });
});


socket.on("update_player_coins", (login, amount) => {

  events.emit("update_player_coins", login, amount);
});


socket.on("chose_card", cards => {

  events.emit("chose_card", cards);

  events.on("card_chosen", keptCardIndex => {

    socket.emit("chose_card", keptCardIndex);

    events.removeAllListeners("card_chosen");
  });
});

socket.on("new_card", card => {

  events.emit("new_card", card);

});

socket.on("player_new_card", login => {

  events.emit("player_new_card", login);

});



socket.on("chose_build_district", amountAllowed => {

  events.emit("chose_build_district", amountAllowed);

  events.on("chose_district", district => {

    socket.emit("chose_build_district", district);
  });
});

socket.on('player_builds_district', (login, district) => {

  events.emit("player_builds_district", login, district);
});

