/* This is a simple AI for Citadels */

import Debug from 'debug';
const debug = Debug('citadels:champion');


export const chose_character = (player, playableCharacters) => {

  return playableCharacters[Math.floor(Math.random() * playableCharacters.length)].name;
};


export const card_or_coin = (player) => {

  return (player.hand.length === 0) ? "card" : "coin";
};


export const chose_card = (cards) => 0;


export const chose_build_district = (player, amountAllowed) => {

  // for (let i = 0; i < amountAllowed; i++) {

  for (const district in player.hand) {

    if (player.hand[district].price <= player.gold) {

      return district;
    }
    // }
  }
};


export const get_assassin = () => 1 + Math.floor(Math.random() * 7);


export const get_thief = () => 2 + Math.floor(Math.random() * 6);


export const get_magician = (player, players) => {

  if (players.length < 2) return;

  let discard = player.hand.length && Boolean(Math.round(Math.random()));
  let exchange = Boolean(Math.round(Math.random()));

  if (exchange) {

    const exchangeable = players.filter(p => p.login !== player.login);

    exchange = exchangeable[Math.floor(Math.random() * exchangeable.length)].login;

  } else if (discard) {

    discard = [];

    const shallowCopy = player.hand.map((_, i) => i);

    const nOfcardsToChange = Math.ceil(Math.random() * shallowCopy.length);

    for (let i = 0; i < nOfcardsToChange; ++i) {

      const randomCardIndex = Math.floor(Math.random() * shallowCopy.length);

      discard.push(shallowCopy[randomCardIndex]);

      shallowCopy.splice(randomCardIndex, 1);
    }
  }

  return { exchange, discard };
};

export const get_warlord = (player, players) => {

  if (players.length < 2) return;

  const attackablePlayersIndexes = players.map((p, i) => p.login !== player.login && p.districts.length ? i : null)
    .filter(Boolean)

  const choseToAttack = true || Boolean(Math.round(Math.random()));

  if (!choseToAttack || !attackablePlayersIndexes.length) return;

  const playerToAttackIndex =
    attackablePlayersIndexes[Math.floor(Math.random() * attackablePlayersIndexes.length)];

  debug('playerToAttackIndex', playerToAttackIndex);

  const districtToAttackIndex = Math.floor(Math.random() * players[playerToAttackIndex].districts.length);

  debug("districtToAttackIndex", districtToAttackIndex);

  return {
    playerIndex: playerToAttackIndex,
    districtIndex: districtToAttackIndex
  }

};