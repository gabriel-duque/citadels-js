/*
 * This is a simple implementation for the Citadels board game in JavaScript
 *
 * if you want to learn about this game:
 *          https://en.wikipedia.org/wiki/Citadels_(card_game)
 *
 */

/* Import our Citadels implementation */
const Game = require('./game.js');

/* The main entrypoint to our script */
const citadels = function(logins){

    /* Create our new game */
    const game = new Game(logins);

    /* The actual game loop */
    while (!game.is_finished) {

        /* Choose characters */
        game.distribute_characters();

        /* Resolve turn */
        game.reveal_characters();
    }

    /* Count points and dump score */
    game.dump();
};

module.exports = citadels;
