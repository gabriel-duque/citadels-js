/* Import what we need from other files */
const {colors, District} = require('./district.js');

/* This is a class to represent a deck */
class Deck {
    constructor() {

        /* Create our deck of ditricts */
        this.cards = [

            /* Green */
            new District(1, 1, colors.GREEN, 'Tavern', 'Tavern', ''),
            new District(1, 1, colors.GREEN, 'Tavern', 'Tavern', ''),
            new District(1, 1, colors.GREEN, 'Tavern', 'Tavern', ''),
            new District(1, 1, colors.GREEN, 'Tavern', 'Tavern', ''),
            new District(1, 1, colors.GREEN, 'Tavern', 'Tavern', ''),

            new District(2, 2, colors.GREEN, 'Market', 'Market', ''),
            new District(2, 2, colors.GREEN, 'Market', 'Market', ''),
            new District(2, 2, colors.GREEN, 'Market', 'Market', ''),
            new District(2, 2, colors.GREEN, 'Market', 'Market', ''),

            new District(2, 2, colors.GREEN, 'Trading Post', 'Trading Post', ''),
            new District(2, 2, colors.GREEN, 'Trading Post', 'Trading Post', ''),
            new District(2, 2, colors.GREEN, 'Trading Post', 'Trading Post', ''),

            new District(4, 4, colors.GREEN, 'Harbor', 'Harbor', ''),
            new District(4, 4, colors.GREEN, 'Harbor', 'Harbor', ''),
            new District(4, 4, colors.GREEN, 'Harbor', 'Harbor', ''),

            new District(5, 5, colors.GREEN, 'Town Hall', 'Town Hall', ''),
            new District(5, 5, colors.GREEN, 'Town Hall', 'Town Hall', ''),

            /* Blue */
            new District(1, 1, colors.BLUE, 'Temple', 'Temple', ''),
            new District(1, 1, colors.BLUE, 'Temple', 'Temple', ''),
            new District(1, 1, colors.BLUE, 'Temple', 'Temple', ''),

            new District(2, 2, colors.BLUE, 'Church', 'Church', ''),
            new District(2, 2, colors.BLUE, 'Church', 'Church', ''),
            new District(2, 2, colors.BLUE, 'Church', 'Church', ''),

            new District(3, 3, colors.BLUE, 'Monastery', 'Monastery', ''),
            new District(3, 3, colors.BLUE, 'Monastery', 'Monastery', ''),
            new District(3, 3, colors.BLUE, 'Monastery', 'Monastery', ''),

            new District(5, 5, colors.BLUE, 'Cathedral', 'Cathedral', ''),
            new District(5, 5, colors.BLUE, 'Cathedral', 'Cathedral', ''),

            /* Red */
            new District(1, 1, colors.RED, 'Watchtower', 'Watchtower', ''),
            new District(1, 1, colors.RED, 'Watchtower', 'Watchtower', ''),
            new District(1, 1, colors.RED, 'Watchtower', 'Watchtower', ''),

            new District(2, 2, colors.RED, 'Prison', 'Prison', ''),
            new District(2, 2, colors.RED, 'Prison', 'Prison', ''),
            new District(2, 2, colors.RED, 'Prison', 'Prison', ''),

            new District(3, 3, colors.RED, 'Battlefield', 'Battlefield', ''),
            new District(3, 3, colors.RED, 'Battlefield', 'Battlefield', ''),
            new District(3, 3, colors.RED, 'Battlefield', 'Battlefield', ''),

            new District(5, 5, colors.RED, 'Fortress', 'Fortress', ''),
            new District(5, 5, colors.RED, 'Fortress', 'Fortress', ''),

            /* Yellow */
            new District(3, 3, colors.YELLOW, 'Manor', 'Manor', ''),
            new District(3, 3, colors.YELLOW, 'Manor', 'Manor', ''),
            new District(3, 3, colors.YELLOW, 'Manor', 'Manor', ''),
            new District(3, 3, colors.YELLOW, 'Manor', 'Manor', ''),
            new District(3, 3, colors.YELLOW, 'Manor', 'Manor', ''),

            new District(4, 4, colors.YELLOW, 'Castle', 'Castle', ''),
            new District(4, 4, colors.YELLOW, 'Castle', 'Castle', ''),
            new District(4, 4, colors.YELLOW, 'Castle', 'Castle', ''),
            new District(4, 4, colors.YELLOW, 'Castle', 'Castle', ''),

            new District(5, 5, colors.YELLOW, 'Palace', 'Palace', ''),
            new District(5, 5, colors.YELLOW, 'Palace', 'Palace', ''),
            new District(5, 5, colors.YELLOW, 'Palace', 'Palace', ''),

            /* Purple */
            new District(2, 2, colors.PURPLE, 'Haunted City', 'Haunted City', ''),

            new District(3, 3, colors.PURPLE, 'Keep', 'Keep', ''),
            new District(3, 3, colors.PURPLE, 'Keep', 'Keep', ''),

            new District(5, 5, colors.PURPLE, 'Laboratory', 'Laboratory', ''),

            new District(5, 5, colors.PURPLE, 'Smithy', 'Smithy', ''),

            new District(5, 5, colors.PURPLE, 'Graveyard', 'Graveyard', ''),

            new District(5, 5, colors.PURPLE, 'Observatory', 'Observatory', ''),

            new District(6, 6, colors.PURPLE, 'School of Magic', 'School of Magic', ''),

            new District(6, 6, colors.PURPLE, 'Library', 'Library', ''),

            new District(6, 6, colors.PURPLE, 'Great Wall', 'Great Wall', ''),

            new District(6, 8, colors.PURPLE, 'University', 'University', ''),

            new District(6, 8, colors.PURPLE, 'Dragon Gate', 'Dragon Gate', ''),
        ];

        /* Shuffle our deck of districts */
        for (let i = this.cards.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count=1) {
        const cards = new Array();
        count = count > this.cards.length ? this.cards.length : count;

        for (let i = 0; i < count; ++i)
            cards.push(this.cards.pop());
        return cards;
    }
}

module.exports = Deck;
