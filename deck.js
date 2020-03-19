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
        name: 'Taverne',
        description: '',
        image_path: ''
    },
    {
        count: 4,
        price: 2,
        value: 2,
        color: colors.GREEN,
        name: 'Marche',
        description: '',
        image_path: ''
    },
    {
        count: 3,
        price: 2,
        value: 2,
        color: colors.GREEN,
        name: 'Echoppe',
        description: '',
        image_path: ''
    },
    {
        count: 3,
        price: 3,
        value: 3,
        color: colors.GREEN,
        name: 'Comptoir',
        description: '',
        image_path: ''
    },
    {
        count: 3,
        price: 4,
        value: 4,
        color: colors.GREEN,
        name: 'Port',
        description: '',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.GREEN,
        name: 'Hotel de Ville',
        description: '',
        image_path: ''
    },

    /* Blue */
    {
        count: 3,
        price: 1,
        value: 1,
        color: colors.BLUE,
        name: 'Temple',
        description: '',
        image_path: ''
    },
    {
        count: 4,
        price: 2,
        value: 2,
        color: colors.BLUE,
        name: 'Eglise',
        description: '',
        image_path: ''
    },
    {
        count: 3,
        price: 3,
        value: 3,
        color: colors.BLUE,
        name: 'Monastere',
        description: '',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.BLUE,
        name: 'Cathedrale',
        description: '',
        image_path: ''
    },

    /* Red */
    {
        count: 3,
        price: 1,
        value: 1,
        color: colors.RED,
        name: 'Tour de guet',
        description: '',
        image_path: ''
    },
    {
        count: 3,
        price: 2,
        value: 2,
        color: colors.RED,
        name: 'Prison',
        description: '',
        image_path: ''
    },
    {
        count: 3,
        price: 3,
        value: 3,
        color: colors.RED,
        name: 'Caserne',
        description: '',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.RED,
        name: 'Forteresse',
        description: '',
        image_path: ''
    },

    /* Yellow */
    {
        count: 5,
        price: 3,
        value: 3,
        color: colors.YELLOW,
        name: 'Manoir',
        description: '',
        image_path: ''
    },
    {
        count: 4,
        price: 4,
        value: 4,
        color: colors.YELLOW,
        name: 'Chateau',
        description: '',
        image_path: ''
    },
    {
        count: 2,
        price: 5,
        value: 5,
        color: colors.YELLOW,
        name: 'Palais',
        description: '',
        image_path: ''
    },

    /* Purple */
    {
        count: 1,
        price: 2,
        value: 2,
        color: colors.PURPLE,
        name: 'Cour des miracles',
        description: 'Pour le decompte final des points, la cour des miracles est consideree comme un quartier de la couleur de votre choix. Vous ne pouvez pas utilisez cette capacite si vous avez construit la cour des miracles au dernier tour de jeu.',
        image_path: ''
    },
    {
        count: 2,
        price: 3,
        value: 3,
        color: colors.PURPLE,
        name: 'Donjon',
        description: 'Le Donjon ne peut pas etre detruit par le Condottiere.',
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Laboratoire',
        description: "Une fois par tour, vous pouvez vous defausser d'une carte quartier de votre main et recevoir une piece d'or en contrepartie.",
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Manufacture',
        description: "Une fois par tour, vous pouvez payer trois pieces d'or pour piocher trois cartes.",
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Cimetiere',
        description: "Lorsque le Condottiere detruit un quartier, vous pouvez payer une piece d'or pour le reprendre dans votre main. Vous ne pouvez pas faire cela si vous etes vous-meme Condottiere.",
        image_path: ''
    },
    {
        count: 1,
        price: 5,
        value: 5,
        color: colors.PURPLE,
        name: 'Observatoire',
        description: "Si vous choisissez de piocher des cartes au debut de votre tour, vous en piochez trois, en choisissez une et defaussez les deux autres.",
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 6,
        color: colors.PURPLE,
        name: 'Ecole de Magie',
        description: "Pour la perception des revenus, l'ecole de magie est consideree comme un quartier de la couleur de votre choix, elle vous rapporte donc si vous etes, Roi, Eveque, Marchand ou Condottiere.",
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 6,
        color: colors.PURPLE,
        name: 'Bibliotheque',
        description: "Si vous choisissez de piocher des cartes au debut de votre tour, vous en piochez deux et les conservez toutes les deux.",
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 8,
        color: colors.PURPLE,
        name: 'Universite',
        description: "Cette realisation de prestige (nul n'a jamais compris a quoi pouvait bien servir une universite) coute six pieces d'or a batir mais vaux huit points dans le decompte de fin de partie.",
        image_path: ''
    },
    {
        count: 1,
        price: 6,
        value: 8,
        color: colors.PURPLE,
        name: 'Dracoport',
        description: "Cette realisation de prestige (on n'a pas vu de dragon dans le Royaume depuis bientot mille ans) coute six pieces d'or à batir mais vaut huit points dans le decompte de fin de partie.",
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

    discard(cards) {
        this.cards.unshift(...cards);
    }
}

module.exports = Deck;
