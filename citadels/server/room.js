import CitadelsGame from './game/game.js';

import Debug from 'debug';
const debug = Debug('citadels:room');


export default class CitadelsRoom {

	static name = 'citadels';

	constructor(logins) {

		this.logins = logins;

		this.game = new CitadelsGame(logins);

		this.bindEvents();
	}

	get isGameRunning() {

		return this.game?.hasStarted && !this.game.isOver
	}


	onHandshakeDone(socket, login) {

		socket.emit("initial_game_state", this.getInitialPrivateGameState(login));

		socket.on("start_loop", () => { // XXX

			debug("Starting game loop");

			this.game.loop();
		});
	}


	/* returns the game state only seen by specific player */
	getInitialPrivateGameState(login) {

		return Object.assign({}, {

			logins: this.logins,

			characters: this.game.characters.map(character => character.name),

			player: {
				login,
				hand: this.game.players.find(player => player.login === login).hand
			}
		});
	}


	/* Bind server game events to client connections */
	bindEvents() {

		this.game.on("message", message => {
			this.sockets.emit("message", message);
		});

		this.game.on('update_player_coins', (player, amount) => {

			player.gold += amount;

			debug(`${player.login} got ${amount} coins`);

			this.sockets.emit('update_player_coins', player.login, player.gold);
		});

		this.game.on('player_builds_district', (login) => {
			this.sockets.emit('player_builds_district', login);
		});

		this.game.on('game_finished', (scores) => {

			debug(scores, '\n');

			this.sockets.emit('game_finished', scores);

			this.closeRoom();

			this.game = null;
		});
	}
}