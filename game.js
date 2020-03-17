/* Import what we need from other files */
const {colors, District} = require('./district.js');
const characters = require('./character.js');
const Deck = require('./deck.js');
const Player = require('./player.js');

/* This class represents a game */
class Game {
    constructor(logins) {

        /* The deck for this game */
        this.deck = new Deck();

        /* The players */
        this.players = new Array();
        for (const login in logins)
            this.players.push(new Player(logins[login], this.deck.draw(4)));

        /* Set the initial king */
        this.king = Math.floor(Math.random() * this.players.length);
        console.log('Initial king: ' + this.players[this.king].login);
    }

    /* Checks if our game is finished */
    is_finished() {
        for (const player in this.players)
            if (this.players[player].districts.length >= 8)
                return true;

        return false;
    }

    /* Distribute characters to all players */
    distribute_characters() {

        /* Get the index of the card ignored this turn */
        const ignored = Math.floor(Math.random() * characters.length);
        console.log('Ignoring character: ' + characters[ignored].name);

        /* Get the list of available characters */
        const remaining_characters = new Array();
        for (let i = 0; i < characters.length; ++i) {
            if (i == ignored)
                continue;
            remaining_characters.push(characters[i]);
        }

        /* Actually get the players choices */
        for (let i = 0; i < this.players.length; ++i) {

            const player = (this.king + i) % this.players.length;

            // XXX: actually get the input from the player
            const character = Math.floor(Math.random()
                    * remaining_characters.length);

            this.players[player].character = remaining_characters[character];

            console.log(this.players[player].login
                        + ' chose '
                        + this.players[player].character.name);

            /* Remove the character from the remaining characters array */
            remaining_characters.splice(character, 1);
        }
    }

    /* Reveal characters and actually play turns */
    reveal_characters() {
        // XXX: reveal characters and handle each players turn
    }

    /* Count points and dump scores */
    dump() {
        // XXX: count points and dump final scores
    }
}

/* Export our Game class */
module.exports = Game;
