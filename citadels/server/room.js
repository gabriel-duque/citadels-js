import CitadelsGame from './game/game.js';

import Debug from 'debug';
const debug = Debug('citadels:room');

import bindEvents from './events.js';

export default class CitadelsRoom {

	static name = 'citadels';

	get isGameRunning() {

		return this.game?.hasStarted && !this.game.isOver
	}

	constructor(logins) {

		this.logins = logins;

		this.game = new CitadelsGame(logins);

		bindEvents.call(this);
	}

	onHandshakeDone(socket, login) {

		this.sockets[login] = socket;

		socket.emit("initial_game_state", this.getInitialPrivateGameState(login));

		socket.on("start_loop", () => { // XXX

			debug("Starting game loop");

			this.game.loop();
		});
	}

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
}