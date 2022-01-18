import Game from '../game/game.js';
import LobbyRoom from './lobby-room.js';
import PlayRoom from './play-room.js';

export default class Room {

  constructor(io) {
    this.io = io;
    this.lobbyRoom = new LobbyRoom(this.io, this);
    this.playRoom = new PlayRoom(this.io, this);
  }

  launchGame() {

    console.log("Creating new game");

    this.players = Object.values(this.lobbyRoom.players);

    this.game = new Game(this.players);

    this.publicGameState = this.getPublicGameState();

    this.bindEvents();

    this.lobbyRoom.emit('start_game');
  }

  isGameRunning() {

    return this.game && this.game.hasStarted && !this.game.isOver
  }

  onHandshakeDone(socket) {

    socket.on("start_loop", () => {
      console.log("Starting loop");
      this.game.loop();
    });

    socket.emit("game_state", this.getPrivateGameState(socket));
  }

  getPrivateGameState(socket) {

    const login = this.playRoom.players[socket.id];

    const player = this.game.players
      .find(player => player.login === login);

    return Object.assign({}, this.publicGameState, {
      hand: player.hand,
    });
  }

  /* returns the game state that can be shared publicly */
  getPublicGameState() {

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

      console.log(scores, '\n');

      for (const [_, socket] of this.playRoom.sockets) {

        this.playRoom.session.remove(socket);

        socket.emit('game_finished', scores);
      }

      this.game = null;
      this.playRoom.players = {};

      for (const [_, socket] of this.playRoom.sockets) {

        socket.emit('redirect', '/');
      }
    });
  }

}