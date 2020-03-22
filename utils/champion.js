/* This is a simple AI for Citadels */

/* Gold or cards */
const get_gold_card = (player) => {
    if (player.hand.length == 0)
        return false; // Get card
    return true;
};

/* Should we buy a district district */
const get_buy_district = (player) => {
    for (const district in player.hand)
        if (player.hand[district].price <= player.gold)
            return district;
    return -1;
};

/* Who should the assassin kill */
const get_assassin = () => 1 + Math.floor(Math.random() * 7);

/* Who should the thief rob */
const get_thief = () => 2 + Math.floor(Math.random() * 6);

/* What should the magician do */
const get_magician = () => {
    return {
        EXCHANGE: false,
        discard: []
    };
};

/* Architect */
const get_architect = () => [];

/* Warlord */
const get_warlord = () => null;

module.exports = {
    get_gold_card: get_gold_card,
    get_buy_district: get_buy_district,
    get_assassin: get_assassin,
    get_thief: get_thief,
    get_magician: get_magician,
    get_architect: get_architect,
    get_warlord: get_warlord
};
