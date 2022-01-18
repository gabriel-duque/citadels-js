import {
  colors
} from './district.js';

import Debug from '../test/debug.js';

/* A simple AI to test the game functionnality */
import * as champion from '../test/champion.js';

/* This class represents a Character card */
export class Character {

  constructor(name, do_turn, image_path) {
    this.name = name;
    this.do_turn = do_turn;
    this.image_path = image_path;
    this.player = null;
  }

  render(hidden = false) {

    if (hidden) {
      Debug("game")("This is a hidden character card.");
    } else {
      Debug("game")(this);
    }
  }
};

/* Choose between gold or cards */
const coin_or_gold = (player, game) => {

  const choice = champion.get_gold_card(player); // XXX: AI I wrote to test

  if (choice) { // Get gold

    Debug("game")("    gets 2 gold");

    player.gold += 2;
  } else { // Get 2 cards and discard one

    Debug("game")("    draws a card");

    const cards = game.deck.draw(2);

    // XXX: for now let's always choose the first card
    const kept_card = champion.choseCard(cards);

    player.hand.push(...cards.splice(kept_card, 1));

    game.deck.discard(cards);
  }
};

/* The normal ending of a turn played by most characters */
const do_normal_end = (player, game) => {

  /* Handle coin or gold choice */
  coin_or_gold(player, game);

  /* Possibly buy a district */
  const choice = champion.get_buy_district(player);

  player.buildDistrict(choice);

  /* Check if this is the 8th district */
  if (player.districts.length === 8) {

    if (game.first_8th === null) {

      Debug("game")("    has built 8 districts");
      game.first_8th = player;
    }

    game.isLastTurn = true;
  }
};

/* Assassin's turn */
const assassin = (player, game) => {

  const choice = champion.get_assassin();

  if (choice !== 0) {

    game.dead_character = game.characters[choice];
  }

  Debug("game")("    kills", game.dead_character && game.dead_character.name);

  do_normal_end(player, game);
};

/* Thief's turn */
const thief = (player, game) => {

  const choice = champion.get_thief();

  /* Can't steel the assassin, it's victim or the thief himself */
  if (choice > 1 && (
      !game.dead_character ||
      game.dead_character &&
      game.characters[choice].name !== game.dead_character.name
    )) {

    game.stolen_character = game.characters[choice];

    Debug("game")("    steals", game.stolen_character.name);
  }

  do_normal_end(player, game);
};

/* Magician's turn */
const magician = (player, game) => {

  const choice = champion.get_magician(player, game.players);

  if (choice.exchange) { // Exchange

    const exchangedPlayer = game.players.find(p => p.login === choice.exchange);

    [player.hand, exchangedPlayer.hand] = [exchangedPlayer.hand, player.hand];

    Debug("game")("   ", player.login, "exchanges with", choice.exchange);

  } else if (choice.discard && choice.discard.length) { // Discard

    Debug("game")("    changes", choice.discard.length, "cards");

    for (
      const cardToRemoveIndex in choice.discard
        .sort()
        .reverse()
    ) {

      game.deck.discard(player.hand.splice(cardToRemoveIndex, 1));
      player.hand.push(game.deck.draw());
    }
  }

  do_normal_end(player, game);
};

/* King's turn */
const king = (player, game) => {

  /* Set king */
  game.firstPlayerToPlayIndex = game.players.findIndex(p => p.login === player.login);

  /* Get extra gold for yellow districts */
  getExtraGold(player, "YELLOW");

  /* Get extra gold */
  do_normal_end(player, game);
};

/* Bishop's turn */
const bishop = (player, game) => {

  /* Get extra gold for blue districts */
  getExtraGold(player, "BLUE");

  /* Get extra gold */
  do_normal_end(player, game);
};

/* Merchant's turn */
const merchant = (player, game) => {

  /* Extra gold coin */
  ++player.gold;

  /* Get extra gold for green districts */
  getExtraGold(player, "GREEN");

  do_normal_end(player, game);
};

/* Architect's turn */
const architect = (player, game) => {

  Debug("game")("    do turn");

  /* Can draw 2 cards */
  player.hand.push(...game.deck.draw(2));

  /* Handle coin or gold choice */
  coin_or_gold(player, game);

  const choices = champion.get_architect()
    .map((_, i) => i)
    .reverse();

  choices.forEach(choice =>
    player.buildDistrict(choice)
  )
};

/* Warlord's turn */
const warlord = (player, game) => {

  /* Get extra gold for red districts */
  getExtraGold(player, "RED");

  /* Destroy a district */
  const choice = champion.get_warlord(player, game.players);

  if (choice) {

    const attackedPlayer = game.players[choice.playerIndex];

    const attackedDistrict = attackedPlayer.districts[choice.districtIndex];

    if (player.gold >= attackedDistrict.price - 1) {

      Debug("game")("    destroys card", attackedDistrict.name, "of", attackedPlayer.login);

      player.gold -= attackedDistrict.price - 1;

      attackedPlayer.districts.splice(choice.district, 1);
    }
  }

  do_normal_end(player, game);
};

function getExtraGold(player, color) {

  player.gold += player.districts.filter(d => d.color === colors[color])
    .length;
}

/* An aray for the different characters */
export const characters = [{
    name: 'Assassin',
    do_turn: assassin,
    image_path: ''
  },
  {
    name: 'Voleur',
    do_turn: thief,
    image_path: ''
  },
  {
    name: 'Magicien',
    do_turn: magician,
    image_path: ''
  },
  {
    name: 'Roi',
    do_turn: king,
    image_path: ''
  },
  {
    name: 'Eveque',
    do_turn: bishop,
    image_path: ''
  },
  {
    name: 'Marchand',
    do_turn: merchant,
    image_path: ''
  },
  {
    name: 'Architecte',
    do_turn: architect,
    image_path: ''
  },
  {
    name: 'Condottiere',
    do_turn: warlord,
    image_path: ''
  }
];