/* This is a simple AI for Citadels */

import Debug from 'debug';
const debug = Debug('citadels:champion');

/* Gold or cards */
export const get_gold_card = (player) => {
  if (player.hand.length == 0)
    return false; // Get card
  return true;
};

/* Should we buy a district district */
export const get_buy_district = (player) => {
  for (const district in player.hand)
    if (player.hand[district].price <= player.gold)
      return district;
  return -1;
};

export const choseCard = (cards) => 0;

/* Who should the assassin kill */
export const get_assassin = () => 1 + Math.floor(Math.random() * 7);

/* Who should the thief rob */
export const get_thief = () => 2 + Math.floor(Math.random() * 6);

/* What should the magician do */
export const get_magician = (player, players) => {

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

  return {
    exchange,
    discard
  };
};

/* Architect */
export const get_architect = () => {
  
  return new Array(Math.round(Math.random() * 3)).fill(1);
};

/* Warlord */
export const get_warlord = (player, players) => {

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