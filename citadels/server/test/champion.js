/* This is a simple AI for Citadels */

import Debug from 'debug';
const debug = Debug('citadels:champion');


export const chose_character = (player, playableCharacters) => {

  return getRandomElement(playableCharacters).name;
};


export const card_or_coin = (player) => {

  return (player.hand.length === 0) ? "card" : "coin";
};


export const chose_card = (cards) => 0;


export const chose_build_district = (player, amountAllowed) => {

  // for (let i = 0; i < amountAllowed; i++) {

  for (const district of player.hand) {

    if (district.price <= player.gold) {

      return district.name;
    }
    // }
  }
};


export const get_assassin = () => 1 + Math.floor(Math.random() * 7);


export const get_thief = () => 2 + Math.floor(Math.random() * 6);


export const get_magician = (player, players) => {

  if (players.length < 2) return;

  let discard = player.hand.length && flipCoin();

  let exchange = flipCoin();

  if (exchange) {

    const exchangeablePlayers = players.filter(p => p.login !== player.login);

    exchange = getRandomElement(exchangeablePlayers).login;

    discard = false;

  } else if (discard) {

    discard = [];

    const handShallowCopy = player.hand.map(c => c.name);

    const nOfcardsToChange = Math.ceil(Math.random() * handShallowCopy.length);

    for (let i = 0; i < nOfcardsToChange; ++i) {

      const randomCardIndex = getRandomIndex(handShallowCopy);

      discard.push(handShallowCopy.splice(randomCardIndex, 1));
    }
  }

  return { discard, exchange};
};

export const get_warlord = (player, players) => {

  if (players.length < 2) return;

  const choseToAttack = true || flipCoin();

  const attackablePlayers = players
    .filter(p =>
      p.login !== player.login && p.districts.length
    )

  if (!choseToAttack || !attackablePlayers.length) return;

  const attackedPlayer = getRandomElement(attackablePlayers);

  return {
    player: attackedPlayer.login,
    district: getRandomElement(attackedPlayer.districts).name
  }

};

function flipCoin() {

  return Boolean(Math.round(Math.random()));
}

function getRandomIndex(array) {

  return Math.floor(Math.random() * array.length);
}

function getRandomElement(array) {

  return array[getRandomIndex(array)];
}