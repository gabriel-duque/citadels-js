import Character from './character.js';
import CHARACTERS from './characters.js';
import Deck from './deck.js';
import EventEmitter from 'events';

import * as champion from '../test/champion.js';

import Debug from 'debug';
const debug = Debug('citadels:game');


export default class Game extends EventEmitter {


  static name = "citadels";


  delay = 200;

  hasStarted = false;

  isOver = false;

  isLastTurn = false;

  deadCharacter = null;

  stolenCharacter = null;

  first8th = null;


  constructor(logins) {

    super();

    this.hasStarted = true;

    this.deck = new Deck();

    this.players = logins.map(login => {

      return {
        login,
        gold: 2,
        districts: [],
        hand: this.deck.draw(4)
      }
    });

    this.characters = CHARACTERS.map(character =>
      new Character(character, this)
    );

    // debug(this);
  }


  askChampion(player, message, ...args) {

    return champion[message](player, ...args);
  }


  setFirstPlayerToPlay() {

    this.firstPlayerToPlayIndex = this.firstPlayerToPlay ?
      this.players.findIndex(p => p.login === this.firstPlayerToPlay) :
      Math.floor(Math.random() * this.players.length);

    const firstPlayer = this.firstPlayerToPlay ||
      this.players[this.firstPlayerToPlayIndex].login;

    this.emit("new_turn", firstPlayer);
  }


  async loop() {

    while (!this.isLastTurn) {

      this.setFirstPlayerToPlay();

      this.resetCharacters();

      const playableCharacters = this.prepareCharacters();

      await this.distributeCharacters(playableCharacters);

      await this.revealCharacters();
    }

    this.endGame();
  }


  endGame() {

    this.isOver = true;

    this.scores = this.dump();

    this.emit('game_finished', this.scores);
  }


  resetCharacters() {

    this.characters.forEach(character => character.player = null);

    this.deadCharacter = null;

    this.stolenCharacter = null;
  }


  prepareCharacters() {

    // todo handle several metas

    const ignoredCharacter = this.characters[Math.floor(Math.random() * this.characters.length)].name;

    this.emit("preparing_characters", ignoredCharacter);

    return this.characters.filter(({ name }) => name !== ignoredCharacter);
  }


  async distributeCharacters(playableCharacters) {

    for (const index in this.players) {

      const player = this.getActivePlayer(index);

      const character = await this.ask(player)("chose_character", playableCharacters);

      this.pickCharacter(player, character, playableCharacters);
    }
  }


  getActivePlayer(i) {

    const player = this.players[(this.firstPlayerToPlayIndex + i) % this.players.length];

    this.emit("player_to_chose_character", player.login);

    return player;
  }


  pickCharacter(player, character, playableCharacters) {

    const characterIndex = playableCharacters.findIndex(c => c.name === character);

    playableCharacters[characterIndex].player = player;

    playableCharacters.splice(characterIndex, 1);

    this.emit("player_has_chosen_character", player.login, character);
  }


  async revealCharacters() {

    this.emit("revealing_characters");

    for (const character of this.characters) {

      if (
        this.isNotUsed(character) ||
        this.isDead(character)
      ) continue;

      await this.doCharacterTurn(character);
    }
  }


  isNotUsed(character) {

    if (!character.player) {

      this.emit("character_not_used", character.name);

      return true
    };
  }


  isDead(character) {

    if (character.name === this.deadCharacter) {

      this.emit("character_is_dead", character.name);

      return true;
    }
  }


  async doCharacterTurn(character) {

    this.emit("reveal_character", character.player.login, character.name);

    this.handleStealing(character);

    await character.doTurn(this);

    this.checkIsLastTurn(character.player);
  }


  handleStealing(character) {

    if (
      !this.stolenCharacter?.player ||
      character.player.login !== this.stolenCharacter.player.login
    ) return;

    this.characters[1].player.gold += character.player.gold;

    character.player.gold = 0;

    this.emit("player_got_stolen", character.player.login, this.stolenCharacter.name);
  }


  checkIsLastTurn(player) {

    if (player.districts.length < 8 || this.first8th) return;

    this.first8th = player;

    this.isLastTurn = true;

    this.emit("player_built_8_districts", player.login);
  }


  dump() {

    return this.players
      .map(this.calculateScore)
      .sort((p1, p2) => p2.score - p1.score);
  }


  calculateScore = ({ districts, login }) => {

    const colorsCount = [];

    let score = districts.reduce(addDistrictPoints, 0);

    if (colorsCount.length >= 5) score += 3;

    if (this.first8th.login === login) score += 4;

    else if (districts.length >= 8) score += 2;

    return { score, login };

    function addDistrictPoints(score, { name, color, value }) {

      if (!colorsCount.includes(color)) colorsCount.push(color);

      if (name === 'Cour des miracles') colorsCount.push("BONUS");

      return score + value;
    }
  }
}