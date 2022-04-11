
export default class Character {


  player = null;


  constructor({ name, action }) {

    this.name = name;

    this.action = action;
  }


  async doTurn(game) {

    await this.getCoinOrGold(game);

    await this.action({ game, player: this.player });

    // todo x3 if is architect
    await this.buildDistrict(game, this.name === 'Architecte' ? 3 : 1);
  }


  async getCoinOrGold(game) {

    const choice = await game.ask(this.player)("card_or_coin");

    if (choice === "coin") {

      game.emit("update_player_coins", this.player, 2);

      return;
    }

    game.emit("player_to_chose_card", this.player.login);

    await this.pickCard(game);
  }


  async pickCard(game) {

    const cards = game.deck.draw(2);

    const keptCardIndex = await game.ask(this.player)("chose_card", cards);

    game.emit("player_has_chosen_card", this.player.login, cards[keptCardIndex]);

    this.player.hand.push(...cards.splice(keptCardIndex, 1));

    game.deck.discard(cards);
  }


  async buildDistrict(game, amountAllowed) {

    const choiceIndex = await game.ask(this.player)("chose_build_district", amountAllowed);

    const choice = this.player.hand[choiceIndex];

    if (!choiceIndex || this.player.gold < choice.price) return;

    this.player.gold -= choice.price;

    game.emit('player_builds_district', this.player.login, choice);

    this.player.districts.push(...this.player.hand.splice(choiceIndex, 1));
  }
};
