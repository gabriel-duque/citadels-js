import Game from '../game/game.js';
import debug from './debug.js';

const logins = ["player1", "player2", "player3", "player4", "player5", "player6"];

const game = new Game(logins);

game.loop();

debug(game.scores);
