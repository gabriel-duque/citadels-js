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
			this.emit("message", message);
		});

		this.game.on('update_player_coins', (login, amount) => {

			this.emit('update_player_coins', login, amount);
		});





		this.game.on('turn', (turn) => {
			this.emit('turn', turn);
		});

		this.game.on('self_turn', (player) => {
			this.emit('self_turn', player);
		});

		this.game.on('player_end_turn', (player) => {
			this.emit('player_end_turn', player);
		});

		this.game.on('player_draws_card', (player) => {
			this.emit('player_discard_card', player);
		});

		this.game.on('player_discards_card', (player) => {
			this.emit('player_discards_card', player);
		});

		this.game.on('player_builds_district', (player) => {
			this.emit('player_builds_district', player);
		});

		this.game.on('player_steals_gold', (player) => {
			this.emit('player_steals_gold', player);
		});

		this.game.on('player_attacks_district', (player) => {
			this.emit('player_steals_gold', player);
		});

		this.game.on('player_is_new_first_to_play', (player) => {
			this.emit('player_is_new_first_to_play', player);
		});

		this.game.on('player_exchange_cards_with_deck', (player) => {
			this.emit('player_exchange_cards_with_deck', player);
		});

		this.game.on('player_exchange_cards_with_player', (player) => {
			this.emit('player_exchange_cards_with_player', player);
		});

		this.game.on('game_finished', (scores) => {

			debug(scores, '\n');

			this.emit('game_finished', scores);

			this.closeRoom();

			this.game = null;
		});

	}

}