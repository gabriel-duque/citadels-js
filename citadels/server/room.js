import GameRoom from '../../srv/app/game-room.js'; // XXX
import CitadelsGame from './game.js';

import Debug from 'debug';
const debug = Debug('citadels:room');


export default class CitadelsRoom extends GameRoom {

  constructor(...args) {

    super(CitadelsGame, ...args);
  }

  get isGameRunning() {

    return this.game && this.game.hasStarted && !this.game.isOver
  }


  onHandshakeDone(socket) {

    socket.emit("initial_game_state", this.getInitialPrivateGameState(socket));

    socket.on("start_loop", () => { // XXX

      debug("Starting game loop");

      this.game.loop();
    });
  }


  /* returns the game state only seen by specific player */
  getInitialPrivateGameState(socket) {

    const login = this.players[socket.id];

    const player = this.game.players.find(player => player.login === login);

    return Object.assign({},
      this.publicGameState, {
      player: {
        login,
        hand: player.hand,
      }
    }
    );
  }


  /* returns the game state that can be shared publicly */
  getInitialPublicGameState() {

    return {
      isLastTurn: this.game.isLastTurn,
      firstPlayerToPlay: this.game.firstPlayerToPlayIndex,
      deckLength: this.game.deck.cards.length,
      characters: this.game.characters.map(character => character.name),
      players: this.game.players.map(player => {

        return {
          login: player.login,
          gold: player.gold,
          handLength: player.hand.length,
          districts: player.districts
        }
      })
    };
  }


  /* Bind server game events to client connections */
  bindEvents() {

    this.game.on('turn', (turn) => {
      this.gameRoom.emit('turn', turn);
    });

    this.game.on('player_left', (player) => {
      this.gameRoom.emit('player_left', player);
    });

    this.game.on('player_turn', (player) => {
      this.gameRoom.emit('player_turn', player);
    });

    this.game.on('player_end_turn', (player) => {
      this.gameRoom.emit('player_end_turn', player);
    });

    this.game.on('player_draws_card', (player) => {
      this.gameRoom.emit('player_discard_card', player);
    });

    this.game.on('player_discards_card', (player) => {
      this.gameRoom.emit('player_discards_card', player);
    });

    this.game.on('player_builds_district', (player) => {
      this.gameRoom.emit('player_builds_district', player);
    });

    this.game.on('player_steals_gold', (player) => {
      this.gameRoom.emit('player_steals_gold', player);
    });

    this.game.on('player_attacks_district', (player) => {
      this.gameRoom.emit('player_steals_gold', player);
    });

    this.game.on('player_is_new_first_to_play', (player) => {
      this.gameRoom.emit('player_is_new_first_to_play', player);
    });

    this.game.on('player_exchange_cards_with_deck', (player) => {
      this.gameRoom.emit('player_exchange_cards_with_deck', player);
    });

    this.game.on('player_exchange_cards_with_player', (player) => {
      this.gameRoom.emit('player_exchange_cards_with_player', player);
    });

    this.game.on('game_finished', (scores) => {

      debug(scores, '\n');

      for (const [_, socket] of this.io.sockets) {

        this.io.session.remove(socket);

        socket.emit('game_finished', scores);
      }

      this.game = null;
      this.players = {};

      for (const [_, socket] of this.io.sockets) {

        socket.emit('redirect', this.lobbyPath);
      }
    });
  }

}