/* Some imports we need */
const {colors, District} = require('./district.js');

/* A simple AI to test the game functionnality */
const champion = require('./champion.js');

/* This class represents a Character card */
class Character {
    constructor(name, do_turn, image_path) {
        this.name = name;
        this.do_turn = do_turn;
        this.image_path = image_path;
        this.player = null;
    }

    render(hidden=false) {
        if (hidden)
            console.log("This is a hidden character card.");
        else
            console.log(this);
    }
};

/* Choose between gold or cards */
const coin_or_gold = (player, game) => {
    const choice = champion.get_gold_card(player); // XXX: AI I wrote to test
    if (choice) { // Get gold
        player.gold += 2;
    } else { // Get 2 cards and discard one
        const cards = game.deck.draw(2);

        // XXX: for now let's always choose the first card
        const kept_card = 0;

        player.hand.push(...cards.splice(kept_card, 1));
        game.deck.discard(cards);
    }
};

/* The normal ending of a turn played by most characters */
const do_normal_end = (player, game) => {

    /* Handle coin or gold choice */
    coin_or_gold(player, game);

    console.log(player);
    /* Possibly buy a district */
    const choice = champion.get_buy_district(player);
    if (choice != -1 && player.gold >= player.hand[choice].price) {
        player.gold -= player.hand[choice].price;
        player.districts.push(...player.hand.splice(choice, 1));

        /* Check if this is the 8th district */
        if (player.districts.length == 8) {
            if (game.first_8th == null)
                game.first_8th = player;
            game.is_finished = true;
        }
            
    }
};

/* Assassin's turn */
const assassin = (player, game) => {
    const choice = champion.get_assassin();
    console.log(choice);
    if (choice != 0)
        game.dead_character == game.characters[choice];
    console.log(game.dead_character);

    do_normal_end(player, game);
};

/* Thief's turn */
const thief = (player, game) => {
    const choice = champion.get_thief();
    
    /* Can't steel the assassin, it's victim or the thief himself */
    if (choice > 1 && game.characters[choice] != game.dead_character)
        game.stolen_character = game.characters[choice];

    do_normal_end(player, game);
};

/* Magician's turn */
const magician = (player, game) => {
    const choice = champion.get_magician();
    if (choice.EXCHANGE) { // Exchange
        [player.hand, this.players[choice.index].hand] = [this.players[choice.index].hand, player.hand];
    } else {
        for (const remove in choice.discard.sort().reverse()) {
            game.deck.discard(player.hand.splice(remove, 1));
            player.hand.push(game.deck.draw());
        }
    }

    do_normal_end(player, game);
};

/* King's turn */
const king = (player, game) => {

    /* Set king */
    game.king = game.players.findIndex((e) => e == player);

    /* Get extra gold for yellow districts */
    for (const district in player.districts)
        if (player.districts[district].color == colors.YELLOW)
            ++player.gold;

    /* Get extra gold */
    do_normal_end(player, game);
};

/* Bishop's turn */
const bishop = (player, game) => {

    /* Get extra gold for blue districts */
    for (const district in player.districts)
        if (player.districts[district].color == colors.BLUE)
            ++player.gold;

    /* Get extra gold */
    do_normal_end(player, game);
};

/* Merchant's turn */
const merchant = (player, game) => {

    /* Extra gold coin */
    ++player.gold;

    /* Get extra gold for green districts */
    for (const district in player.districts)
        if (player.districts[district].color == colors.GREEN)
            ++player.gold;

    do_normal_end(player, game);
};

/* Architect's turn */
const architect = (player, game) => {

    /* Can draw 2 cards */
    player.hand.push(...game.deck.draw(2));

    /* Handle coin or gold choice */
    coin_or_gold(player, game);

    const choices = champion.get_architect();
    if (choices.length <= 3) {
        for (const choice in choices) {
            if (player.gold >= player.hand[choice].price) {
                player.gold -= player.hand[choice].price;
                player.districts.push(...player.hand.splice(choice, 1));
            }
        }
    }
};

/* Warlord's turn */
const warlord = (player, game) => {

    /* Get extra gold for red districts */
    for (const district in player.districts)
        if (player.districts[district].color == colors.RED)
            ++player.gold;

    /* Destroy a district */
    const choice = champion.get_warlord();
    if (choice != null
            && player.gold >= game.players[choice.player].districts[choice.district].price - 1) {
        player.gold -= (game.players[choice.player].districts[choice.district].price - 1);
        game.players[choice.player].districts.splice(choice.district, 1);
    }

    do_normal_end(player, game);
};

/* An aray for the different characters */
const characters = [
    {
        name: 'Assassin',
        do_turn: assassin,
        image_path: ''
    },
    {
        name: 'Voleur',
        do_turn: thief,
        image_path: ''
    },
    {
        name: 'Magicien',
        do_turn: magician,
        image_path: ''
    },
    {
        name: 'Roi',
        do_turn: king,
        image_path: ''
    },
    {
        name: 'Eveque',
        do_turn: bishop,
        image_path: ''
    },
    {
        name: 'Marchand',
        do_turn: merchant,
        image_path: ''
    },
    {
        name: 'Architecte',
        do_turn: architect,
        image_path: ''
    },
    {
        name: 'Condottiere',
        do_turn: warlord,
        image_path: ''
    }
];

module.exports = {
    characters: characters,
    Character: Character
};
