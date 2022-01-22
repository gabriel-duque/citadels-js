import Game from '../game.js';
import Debug from 'debug';

const logins = ["player1", "player2", "player3", "player4", "player5", "player6"];

const game = new Game(logins);

game.loop();

Debug("citadels:test")(this.nameSpace.namegame.scores);
