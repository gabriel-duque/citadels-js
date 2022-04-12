import Game from '../game/game.js';


const N_PLAYERS = 2;


const logins = new Array(N_PLAYERS)
    .fill()
    .map((_, i) => `player${i}`);


const game = new Game(logins);

game.ask = player =>
    (message, ...args) =>
        game.askChampion(player, message, ...args);

game.emit = (message, ...args) =>
    console.log(`"${message}":`, ...args);

game.loop();
