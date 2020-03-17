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
const citadels = () => {
    /* 
     * XXX: Here we should get input from our users which should be a login
     *      array.
     *
     *      This is just test input I used to test the game
     *
     */
    const test_logins = [
        'zuh0',
        'ShallowRed',
        'Bovary',
        'Roonie',
        'Bagu'
    ];

    /* Create our new game */
    const game = new Game(test_logins);

    /* The actual game loop */
    while (!game.is_finished()) {

        /* Choose characters */
        game.distribute_characters();

        /* Resolve turn */
        game.reveal_characters();
    }

    /* Count points and dump score */
    game.dump();
};


citadels();
