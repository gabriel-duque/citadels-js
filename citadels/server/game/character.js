import { colors } from './district.js';

import Debug from 'debug';
const debug = Debug("citadels:character");

import * as champion from '../test/champion.js';

export class Character {

  constructor(name, do_turn, image_path) {
    this.name = name;
    this.do_turn = do_turn;
    this.image_path = image_path;
    this.player = null;
  }
};

/* An aray for the different characters */
export const characters = [{
  name: 'Assassin',
  do_turn: assassin,
},
{
  name: 'Voleur',
  do_turn: thief,
},
{
  name: 'Magicien',
  do_turn: magician,
},
{
  name: 'Roi',
  do_turn: king,
},
{
  name: 'Eveque',
  do_turn: bishop,
},
{
  name: 'Marchand',
  do_turn: merchant,
},
{
  name: 'Architecte',
  do_turn: architect,
},
{
  name: 'Condottiere',
  do_turn: warlord,
}
];

/* Choose between gold or cards */
async function coin_or_gold(player, game) {
  
  const choice = await game.ask(player.login)("coin_or_gold");
  // const choice = champion.get_gold_card(player); // XXX: AI I wrote to test

  if (choice === "coin") {

    player.gold += 2;

    game.emit("update_player_coins", player.login, player.gold);

    debug("gets 2 gold");

  } else {

    debug("draws a card");
    game.emit("message", `${player.login} has chosen to get a card`);

    const cards = game.deck.draw(2);

    // XXX: for now let's always choose the first card
    const kept_card = champion.choseCard(cards);

    player.hand.push(...cards.splice(kept_card, 1));

    game.deck.discard(cards);
  }
};

/* The normal ending of a turn played by most characters */
async function do_normal_end(player, game) {

  /* Handle coin or gold choice */
  await coin_or_gold(player, game);

  /* Possibly buy a district */
  const choice = champion.get_buy_district(player);

  player.buildDistrict(choice);

  /* Check if this is the 8th district */
  if (player.districts.length === 8) {

    if (game.first_8th === null) {

      debug("has built 8 districts");
      game.first_8th = player;
    }

    game.isLastTurn = true;
  }
};

/* Assassin's turn */
async function assassin(player, game) {

  const choice = champion.get_assassin();

  if (choice !== 0) {

    game.dead_character = game.characters[choice];
  }

  debug("kills", game.dead_character && game.dead_character.name);

  await do_normal_end(player, game);
};

/* Thief's turn */
async function thief(player, game) {

  const choice = champion.get_thief();

  /* Can't steel the assassin, it's victim or the thief himself */
  if (choice > 1 && (
    !game.dead_character ||
    game.dead_character &&
    game.characters[choice].name !== game.dead_character.name
  )) {

    game.stolen_character = game.characters[choice];

    debug("steals", game.stolen_character.name);
  }

  await do_normal_end(player, game);
};

/* Magician's turn */
async function magician(player, game) {

  const choice = champion.get_magician(player, game.players);

  if (choice.exchange) { // Exchange

    const exchangedPlayer = game.players.find(p => p.login === choice.exchange);

    [player.hand, exchangedPlayer.hand] = [exchangedPlayer.hand, player.hand];

    debug("   ", player.login, "exchanges with", choice.exchange);

  } else if (choice.discard && choice.discard.length) { // Discard

    debug("changes", choice.discard.length, "cards");

    for (
      const cardToRemoveIndex in choice.discard
        .sort()
        .reverse()
    ) {

      game.deck.discard(player.hand.splice(cardToRemoveIndex, 1));
      player.hand.push(game.deck.draw());
    }
  }

  await do_normal_end(player, game);
};

async function king(player, game) {

  /* Set king */
  game.firstPlayerToPlayIndex = game.players.findIndex(p => p.login === player.login);

  /* Get extra gold for yellow districts */
  getExtraGold(player, "YELLOW");

  /* Get extra gold */
  await do_normal_end(player, game);
};

async function bishop(player, game) {

  /* Get extra gold for blue districts */
  getExtraGold(player, "BLUE");

  /* Get extra gold */
  await do_normal_end(player, game);
};

async function merchant(player, game) {

  /* Extra gold coin */
  ++player.gold;

  /* Get extra gold for green districts */
  getExtraGold(player, "GREEN");

  await do_normal_end(player, game);
};

/* Architect's turn */
async function architect(player, game) {

  debug("do turn");

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
async function warlord(player, game) {

  /* Get extra gold for red districts */
  getExtraGold(player, "RED");

  /* Destroy a district */
  const choice = champion.get_warlord(player, game.players);

  if (choice) {

    const attackedPlayer = game.players[choice.playerIndex];

    const attackedDistrict = attackedPlayer.districts[choice.districtIndex];

    if (player.gold >= attackedDistrict.price - 1) {

      debug("destroys card", attackedDistrict.name, "of", attackedPlayer.login);

      player.gold -= attackedDistrict.price - 1;

      attackedPlayer.districts.splice(choice.district, 1);
    }
  }

  await do_normal_end(player, game);
};

function getExtraGold(player, color) {

  player.gold += player.districts.filter(d => d.color === colors[color])
    .length;
}