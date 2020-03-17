/* Import what we need from other files */
const {colors, District} = require('./district.js');

/*
 * The initial deck:
 */
const initial_deck = [

    /* Green */
    {
        count: 5,
        price: 1,
        value: 1,
        color: colors.GREEN,
        name: 'Tavern',
        description: 'Tavern',
        image_path: ''
    },
    {
        count: 4,
        price: 2,
        value: 2,
        color: colors.GREEN,
        name: 'Market',
        description: 'Market',
        image_path: ''
    },
    {
        count: 3,
        price: 2,
        value: 2,
        color: colors.GREEN,
        name: 'Trading Post',
        description: 'Trading Post',
        image_path: ''
    },
    {
        count: 3,
        price: 4,
        value: 4,
        color: colors.GREEN,
        name: 'Harbor',
        description: 'Harbor',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.GREEN,
        name: 'Town Hall',
        description: 'Town Hall',
        image_path: ''
    },

    /* Blue */
    {
        count: 3,
        price: 1,
        value: 1,
        color: colors.BLUE,
        name: 'Temple',
        description: 'Temple',
        image_path: ''
    },
    {
        count: 3,
        price: 2,
        value: 2,
        color: colors.BLUE,
        name: 'Church',
        description: 'Church',
        image_path: ''
    },
    {
        count: 3,
        price: 3,
        value: 3,
        color: colors.BLUE,
        name: 'Monastery',
        description: 'Monastery',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.BLUE,
        name: 'Cathedral',
        description: 'Cathedral',
        image_path: ''
    },

    /* Red */
    {
        count: 3,
        price: 1,
        value: 1,
        color: colors.RED,
        name: 'Watchtower',
        description: 'Watchtower',
        image_path: ''
    },
    {
        count: 3,
        price: 2,
        value: 2,
        color: colors.RED,
        name: 'Prison',
        description: 'Prison',
        image_path: ''
    },
    {
        count: 3,
        price: 3,
        value: 3,
        color: colors.RED,
        name: 'Battlefield',
        description: 'Battlefield',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.RED,
        name: 'Fortress',
        description: 'Fortress',
        image_path: ''
    },

    /* Yellow */
    {
        count: 5,
        price: 3,
        value: 3,
        color: colors.YELLOW,
        name: 'Manor',
        description: 'Manor',
        image_path: ''
    },
    {
        count: 4,
        price: 4,
        value: 4,
        color: colors.YELLOW,
        name: 'Castle',
        description: 'Castle',
        image_path: ''
    },
    {
        count: 3,
        price: 5,
        value: 5,
        color: colors.YELLOW,
        name: 'Palace',
        description: 'Palace',
        image_path: ''
    },

    /* Purple */
    {
        count: 1,
        price: 2,
        value: 2,
        color: colors.PURPLE,
        name: 'Haunted City',
        description: 'Haunted City',
        image_path: ''
    },
    {
        count: 2,
        price: 3,
        value: 3,
        color: colors.PURPLE,
        name: 'Keep',
        description: 'Keep',
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Laboratory',
        description: 'Laboratory',
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Smithy',
        description: 'Smithy',
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Graveyard',
        description: 'Graveyard',
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Observatory',
        description: 'Observatory',
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 6,
        color: colors.PURPLE,
        name: 'School of Magic',
        description: 'School of Magic',
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 6,
        color: colors.PURPLE,
        name: 'Library',
        description: 'Library',
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 6,
        color: colors.PURPLE,
        name: 'Great Wall',
        description: 'Great Wall',
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 8,
        color: colors.PURPLE,
        name: 'University',
        description: 'University',
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 8,
        color: colors.PURPLE,
        name: 'Dragon Gate',
        description: 'Dragon Gate',
        image_path: ''
    },

];

/* This is a class to represent a deck */
class Deck {
    constructor() {

        /* Create our deck of ditricts using the initial deck */
        this.cards = new Array();
        for (const district in initial_deck) {
            const current = initial_deck[district];
            for (let i = 0; i < current.count; ++i) {
                this.cards.push(new District(current.price,
                                             current.value,
                                             current.color,
                                             current.name,
                                             current.description,
                                             current.image_path));
            }
        }

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
