/* Import what we need from other files */
const {colors, District} = require('./district.js');
const {characters, Character} = require('./character.js');
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

        /* The characters */
        this.characters = new Array();
        for (const character in characters)
            this.characters.push(new Character(characters[character].name,
                                               characters[character].do_turn,
                                               characters[character].image_path));

        /* Set the initial king */
        this.king = Math.floor(Math.random() * this.players.length);
        console.log('Initial king: ' + this.players[this.king].login);

        /* This tells us if the game id finished */
        this.is_finished = false;

        /* The dead character */
        this.dead_character = null;

        /* The stolen character */
        this.stolen_character = null;

        /* First player to put an 8th district */
        this.first_8th = null;
    }

    /* Distribute characters to all players */
    distribute_characters() {

        /* Get the index of the card ignored this turn */
        const ignored = Math.floor(Math.random() * this.characters.length);
        this.characters[ignored].player = null;
        console.log('Ignoring character: ' + this.characters[ignored].name);

        /* Get the list of available characters */
        const remaining_characters = new Array();
        for (let i = 0; i < this.characters.length; ++i) {
            if (i == ignored)
                continue;
            remaining_characters.push(this.characters[i]);
        }

        /* Actually get the players choices */
        for (let i = 0; i < this.players.length; ++i) {

            const player = (this.king + i) % this.players.length;

            // XXX: actually get the input from the player
            const character = Math.floor(Math.random()
                    * remaining_characters.length);

            remaining_characters[character].player = this.players[player];

            console.log(this.players[player].login
                        + ' chose '
                        + remaining_characters[character].name);

            /* Remove the character from the remaining characters array */
            remaining_characters.splice(character, 1);
        }
    }

    /* Reveal characters and actually play turns */
    reveal_characters() {
        for (let i = 0; i < this.characters.length; ++i) {
            console.log(this.characters[i]);
            if (this.characters[i].player != null
                && this.characters[i] != this.dead_character) {
                if (this.characters[i] == this.stolen_character) {
                    this.characters[1].player.gold += this.characters[i].player.gold;
                    this.characters[i].player.gold = 0;
                }
                this.characters[i].do_turn(this.characters[i].player, this);
            }
        }

        console.log('The dead character was: ' + this.dead_character);
        this.dead_character = null;
        this.stolen_character = null;
    }

    /* Count points and dump scores */
    dump() {
        console.log('SCORE COUNTING');

        const scores = new Array();

        for (const player_ndx in this.players) {
            const player = this.players[player_ndx];
            console.log(player);
            const color_map = {
                RED: false,
                BLUE: false,
                GREEN: false,
                YELLOW: false,
                PURPLE: false
            };

            let got_haunted_city = false; // Cour des miracles
            let score = 0;

            for (const district_ndx in player.districts) {
                const district = player.districts[district_ndx];

                /* Add basic value */
                score += district.value;

                /* Add it to our color list (yes, this is ugly, f*** you.) */
                if (district.color == colors.RED)
                    color_map.RED = true;
                else if (district.color == colors.BLUE)
                    color_map.BLUE = true;
                else if (district.color == colors.GREEN)
                    color_map.GREEN = true;
                else if (district.color == colors.YELLOW)
                    color_map.YELLOW = true;
                else if (district.color == colors.PURPLE)
                    color_map.PURPLE = true;

                /* Special rule for 'Haunted City' */
                if (district.name == 'Cour des miracles')
                    got_haunted_city = true;
            }

            /* Count how many colors */
            let color_count = 0;
            for (const color in color_map)
                if (color_map.color)
                    ++color_count;

            /* Give points for colors */
            if (color_count == 5 || (color_count == 4 && got_haunted_city))
                score += 3;

            /* Special case for the first player to build 8th district */
            if (this.first_8th == player)
                score += 4;
            else if (player.districts.length >= 8)
                score += 2;

            /* Add entry to our scores array for this player */
            scores.push({
                login: player.login,
                score: score
            });
        }

        /* Sort our score array */
        scores.sort((e1, e2) =>  e2.score - e1.score);

        console.log('SCORES:');
        for (const res in scores)
            console.log('\tLogin: ' + scores[res].login
                        + ', Score: ' + scores[res].score);
    }
}

/* Export our Game class */
module.exports = Game;
