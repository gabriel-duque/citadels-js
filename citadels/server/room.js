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

		this.sockets[login] = socket;

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


		this.game.on("new_turn", firstPlayer => {

			debug("----------------\nNew turn, first player to play is", firstPlayer);

			this.sockets.emit("new_turn", firstPlayer);
		});


		this.game.on("preparing_characters", ignoredCharacter => {

			debug('Ignoring character:', ignoredCharacter);
		});


		this.game.on("player_to_chose_character", login => {
			
			debug(`${login} is choosing a character`);	

			this.sockets.emit("message", `${login} is choosing a character`);
		});


		this.game.on("player_has_chosen_character", (login, character) => {
			
			debug(`${login} has chosen character ${character}`);	

			this.sockets.emit("message", `${login} has chosen a character`);
		});


		this.game.on("revealing_characters", () => {

			debug("--------\nRevealing characters");

			this.sockets.emit("message", "Revealing characters");
		});

		this.game.on("character_not_used", character => {

			debug(`- ${character} is not used`);

			this.sockets.emit("message", `- ${character} is not used`);
		});

		this.game.on("character_is_dead", character => {

			debug(`- ${character} is dead`);

			this.sockets.emit("message", `- ${character} is dead`);
		});

		this.game.on("reveal_character", (login, character) => {

			this.sockets.emit("message", `${character} was chosen by ${login}`);

			debug(`- ${character} is played by ${login}`);

		});

		this.game.on("player_got_stolen", (login, character) => {

			this.sockets.emit("message", `${login} got stolen as ${character}`);

			debug(`${login} got stolen as ${character}`);
		});


		this.game.on("player_to_chose_card", login => {

			this.sockets.emit("message", `${login} has chosen to get a card`);

			debug(`${login} has chosen to get a card`);
		});


		this.game.on("player_has_chosen_card", (login, card) => {

			this.sockets[login].emit("new_card", card);

			this.sockets[login].broadcast.emit("player_new_card", login);

			this.sockets.emit("message", `${login} has picked a card`);

			debug(`${login} has picked card:`, card.name);
		});
		
		this.game.on("player_built_8_districts", login => {

			this.sockets.emit("message", `${login} has built 8th district`);

			debug(`${login} has built 8th district`);
		});



		this.game.on('update_player_coins', (player, amount) => {

			player.gold += amount;

			debug(`${player.login} got ${amount} coins`);

			this.sockets.emit('update_player_coins', player.login, player.gold);
		});


		this.game.on('player_builds_district', (login, district) => {

			debug(`${login} built district: ${district.name}`);

			this.sockets.emit('player_builds_district', login, district);
		});


		this.game.on('game_finished', (scores) => {

			debug("============\n Game finished, scores:\n", scores);

			this.sockets.emit('game_finished', scores);

			this.closeRoom();

			this.game = null;
		});
	}
}