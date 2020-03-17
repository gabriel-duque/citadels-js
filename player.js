/* This is a class to represent a player */
class Player {
    constructor(login, hand) {
        this.login = login;
        this.hand = hand;
        this.districts = new Array();
        this.gold = 2; /* Players start with 2 gold coins */
        this.character;
    }

    render() {
        console.log(this);
    }
}

module.exports = Player;
