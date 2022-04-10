/*
 * This is a simple implementation for the Citadels board game in JavaScript
 *
 * if you want to learn about this game:
 *          https://en.wikipedia.org/wiki/Citadels_(card_game)
 *
 */

import { characters, Character } from './character.js';
import Deck from './deck.js';
import Player from './player.js';
import EventEmitter from 'events';

import Debug from 'debug';
const debug = Debug('citadels:game');

/* This class represents a game */
export default class Game extends EventEmitter {

  static name = "citadels";

  players = [];

  hasStarted = false;

  isOver = false;

  isLastTurn = false;

  dead_character = null;

  stolen_character = null;

  /* First player to put an 8th district */
  first_8th = null;

  constructor(logins) {

    super();

    this.hasStarted = true;

    /* The deck for this game */
    this.deck = new Deck();

    /* The players */
    this.players = logins.map(login =>
      new Player(login, this.deck.draw(4))
    );

    this.characters = characters.map(character => new Character(
      character.name,
      character.do_turn,
      character.image_path
    ));

    /* Set the initial first player to play */
    this.firstPlayerToPlayIndex = Math.floor(Math.random() * this.players.length);

    // debug(this);
  }

  async loop() {

    const firstPlayer = this.players[this.firstPlayerToPlayIndex].login;

    debug('First player to play: ', firstPlayer);

    this.emit("message", `${firstPlayer} plays first`);

    /* The actual game loop */
    while (!this.isLastTurn) {

      /* Choose characters */
      await this.distribute_characters();

      /* Resolve turn */
      await this.reveal_characters();
    }

    this.isOver = true;

    /* Count points and dump score */
    this.scores = this.dump();
    this.emit('game_finished', this.scores);
  }

  /* Distribute characters to all players */
  async distribute_characters() {

    this.characters.forEach(character => {
      character.player = null;
    });

    debug("----------------\nNew turn, distributing characters");

    this.emit("message", "New turn, distributing characters");

    /* Get the index of the card ignored this turn */
    const ignoredIndex = Math.floor(Math.random() * this.characters.length);

    debug('Ignoring character: ', this.characters[ignoredIndex].name);

    /* Get the list of available characters */
    const remaining_characters = this.characters.filter((_, i) => i !== ignoredIndex);

    /* Actually get the players choices */
    for (let i = 0; i < this.players.length; ++i) {

      const player = (this.firstPlayerToPlayIndex + i) % this.players.length;

      // XXX: actually get the input from the player
      this.emit("message", `${this.players[player].login} is choosing a character`);
      const character = await this.ask(this.players[player].login)("chose_character", remaining_characters);
      // YYY: champion way
      // const character = Math.floor(Math.random() * remaining_characters.length);
      const characterIndex = remaining_characters.findIndex(c => c.name === character);

      remaining_characters[characterIndex].player = this.players[player];

      debug(this.players[player].login + ' chose ' + remaining_characters[characterIndex].name);

      /* Remove the character from the remaining characters array */
      remaining_characters.splice(characterIndex, 1);
    }
  }

  /* Reveal characters and actually play turns */
  async reveal_characters() {

    debug("--------\nRevealing characters");

    this.emit("message", "Revealing characters");

    for (let i = 0; i < this.characters.length; ++i) {

      const character = this.characters[i];

      if (!character.player) {

        debug(`-${character.name} is not used`);
        this.emit("message", `-${character.name} is not used`);

        continue
      };

      const isAlive = !this.dead_character ||
        this.dead_character && character.name !== this.dead_character.name

      if (isAlive) {

        this.emit("message", `${character.name} was chosen by ${character.player.login}`);

        if (this.stolen_character?.player && character.player.login === this.stolen_character.player.login) {

          debug(`-${character.name} got stolen`);
          this.emit("message", `-${character.name} got stolen`);

          this.characters[1].player.gold += character.player.gold;

          character.player.gold = 0;
        }

        await character.do_turn(character.player, this);

      } else {
        debug(`-${character.name} is dead and doesnt play`);
        this.emit("message", `-${character.name} is dead and doesnt play`);
      }
    }

    this.dead_character = null;
    this.stolen_character = null;
  }

  /* Count points and dump scores */
  dump() {

    debug("============\n Game finished, scores:");
    this.emit("message", 'Game finished');

    return this.players.map(({
      districts,
      login
    }) => {

      let colorsCount = [];

      let score = districts.reduce((score, district) => {

        if (
          !colorsCount.includes(district.color)
        ) {
          colorsCount.push(district.color);
        }

        if (district.name == 'Cour des miracles') {
          colorsCount.push("BONUS");
        }

        return score + district.value;
      }, 0)

      /* Give points for colors */
      if (colorsCount.length >= 5) {
        score += 3;
      }

      /* Special case for the first player to build 8th district */
      if (this.first_8th.login == login) {
        score += 4;
      } else if (districts.length >= 8) {
        score += 2;
      }

      return {
        login,
        score
      };
    })
      .sort((p1, p2) => p2.score - p1.score);
  }
}