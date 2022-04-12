
export default class Character {


  player = null;


  constructor(character) {

    this.character = character;

    this.name = character.name;

    this.action = character.action;
  }


  async doTurn(game) {

    await this.getCoinOrGold(game);

    await this.action.bind(this.character)({ game, player: this.player });

    // todo x3 if is architect
    await this.buildDistrict(game, this.name === 'Architecte' ? 3 : 1);
  }


  async getCoinOrGold(game) {

    const choice = await game.ask(this.player)("card_or_coin");

    if (choice === "coin") {

      game.emit("player_chose_coin", this.player);

      return;
    }

    await this.pickCard(game);
  }


  async pickCard(game) {

    game.emit("player_to_chose_card", this.player.login);

    const cards = game.deck.draw(2);

    const keptCardIndex = await game.ask(this.player)("chose_card", cards);

    game.emit("player_has_chosen_card", this.player.login, cards[keptCardIndex]);

    this.player.hand.push(...cards.splice(keptCardIndex, 1));

    game.deck.discard(cards);
  }


  async buildDistrict(game, amountAllowed) {

    game.emit("player_to_build_district", this.player.login);

    let choice = await game.ask(this.player)("chose_build_district", amountAllowed);

    const choiceIndex = this.player.hand.findIndex(card => card.name === choice);
    
    const [district] = this.player.hand.splice(choiceIndex, 1);

    if (!district || this.player.gold < district.price) return;

    this.player.gold -= district.price;

    game.emit('player_builds_district', this.player.login, district);

    this.player.districts.push(district);
  }
};
