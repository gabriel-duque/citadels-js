import Debug from '../debug.config.js';
const debug = Debug('game:citadels');

/* This is a class to represent a player */
export default class Player {

  gold = 2; /* Players start with 2 gold coins */
  
  districts = [];

  constructor(login, hand) {
    this.login = login;
    this.hand = hand;
  }

  render() {
    debug(this);
  }

  buildDistrict(choiceIndex) {

    if (
      choiceIndex >= 0 &&
      choiceIndex < this.hand.length &&
      this.gold >= this.hand[choiceIndex].price
    ) {

      this.gold -= this.hand[choiceIndex].price;

      debug("    builds", this.hand[choiceIndex].name);

      this.districts.push(...this.hand.splice(choiceIndex, 1));
    }
  }
}