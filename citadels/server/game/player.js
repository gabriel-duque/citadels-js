import Debug from 'debug';
const debug = Debug('citadels:players');

export default class Player {

  gold = 2;

  districts = [];

  constructor(login, hand) {

    this.login = login;

    this.hand = hand;
  }

  buildDistrict(choice) {

    if (!choice || this.gold < choice.price) return;

    const choiceIndex = this.hand.findIndex(card => card.name === choice.name);

    if (!choiceIndex) return;

    this.gold -= choice.price;

    debug("builds", choice.name);

    this.districts.push(...this.hand.splice(choiceIndex, 1));
  }
}