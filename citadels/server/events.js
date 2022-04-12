import Debug from 'debug';
const debug = Debug('citadels:game');

export default function () {

    
    this.game.on("new_turn", firstPlayer => {

        debug("----------------\nNew turn, first player to play is", firstPlayer);

        this.sockets.emit("new_turn", firstPlayer);
    });


    this.game.on("preparing_characters", ignoredCharacter => {

        debug('Ignoring character:', ignoredCharacter);
    });


    this.game.on("player_to_chose_character", login => {

        debug(`${login} is choosing a character`);

        this.sockets.emit("player_to_chose_character", login);
    });


    this.game.on("player_has_chosen_character", (login, character) => {

        debug(`${login} has chosen character ${character}`);

        this.sockets.emit("message", `${login} has chosen a character`);
    });


    this.game.on("revealing_characters", () => {

        debug("--------\nRevealing characters");

        this.sockets.emit("message", "Revealing characters");
    });


    this.game.on("reveal_character", (login, character) => {

        debug(`- ${character} is played by ${login}`);

        this.sockets.emit("reveal_character", login, character);
    });


    this.game.on("character_not_used", character => {

        debug(`- ${character} is not used`);

        this.sockets.emit("character_not_used", character);
    });


    this.game.on("character_is_dead", character => {

        debug(`- ${character} is dead`);

        this.sockets.emit("character_is_dead", character);
    });


    this.game.on("player_got_stolen", (login, character) => {

        debug(`${login} got stolen as ${character}`);

        this.sockets.emit("player_got_stolen", login, character);
    });


    this.game.on('player_chose_coin', player => {

        player.gold += 2;

        debug(`${player.login} chose 2 coins`);

        this.sockets.emit('player_chose_coin', player.login, player.gold);
    });


    this.game.on("player_to_chose_card", login => {

        this.sockets.emit("message", `${login} has chosen to get a card`);

        debug(`${login} has chosen to get a card`);
    });


    this.game.on("player_has_chosen_card", (login, card) => {

        this.sockets[login].emit("new_card", card);

        this.sockets[login].broadcast.emit("player_new_card", login);

        this.sockets.emit("message", `${login} has picked a card`);

        debug(`${login} has picked card:`, card.name);
    });


    this.game.on("character_killed", deadCharacter => {

        this.sockets.emit("message", `${deadCharacter} is dead`);

        debug(`${deadCharacter} is dead`);
    });

    this.game.on("character_stolen", deadCharacter => {

        this.sockets.emit("message", `${deadCharacter} got stolen`);

        debug(`${deadCharacter} got stolen`);
    });

    this.game.on("player_exchanged", (player, exchangedPlayer) => {

        this.sockets.emit("message", `${player.login} exchanged with ${exchangedPlayer.login}`);

        this.sockets[player.login].emit("new_hand", player.hand);

        this.sockets[exchangedPlayer.login].emit("new_hand", exchangedPlayer.hand);

        this.sockets.emit("new_hand_length", player.login, player.hand.length);
        this.sockets.emit("new_hand_length", exchangedPlayer.login, exchangedPlayer.hand.length);

        debug(`${player.login} exchanges cards with ${exchangedPlayer.login}`);
    });


    this.game.on("player_discarded", (player, amount) => {

        this.sockets.emit("message", `${player.login} discarded ${amount} cards`);

        this.sockets[player.login].emit("new_hand", player.hand);

        this.sockets.emit("new_hand_length", player.login, player.hand.length);

        debug(`${player.login} discarded ${amount} cards`);
    });

    this.game.on("player_got_one_gold", (player) => {

        this.sockets.emit("message", `${player.login} got 1 gold as merchant`);

        this.sockets.emit("new_gold", player.login);

        debug(`${player.login} got 1 gold as merchant`);
    });


    this.game.on("extra_gold", (player, color, amount) => {

        this.sockets.emit("message", `${player.login} got ${amount} gold for ${color} districts`);

        this.sockets.emit("extra_gold", player.login, amount);

        debug(`${player.login} got ${amount} gold for ${color} districts`);
    });

    this.game.on("player_destroyed_district", (player, attackedPlayer, attackedDistrict, price) => {

        this.sockets.emit("message", `${player.login} destroyed ${attackedDistrict.name} of ${attackedPlayer.login} for ${price} gold`);

        this.sockets.emit("destroyed_district", player.login, attackedPlayer.login, attackedDistrict.name, price);

        debug(`${player.login} destroyed ${attackedDistrict.name} of ${attackedPlayer.login} for ${price} gold`);
    });


    this.game.on("player_to_build_district", login => {

        this.sockets.emit("message", `${login} can now chose to build a district`);

        debug(`${login} can now chose to build a district`);
    });


    this.game.on('player_builds_district', (login, district) => {

        debug(`${login} built district: ${district.name}`);

        this.sockets.emit('player_builds_district', login, district);
    });


    this.game.on("player_built_8_districts", login => {

        this.sockets.emit("message", `${login} has built 8th district`);

        debug(`${login} has built 8th district`);
    });


    this.game.on('game_finished', (scores) => {

        debug("============\n Game finished, scores:\n", scores);

        this.sockets.emit('game_finished', scores);

        this.closeRoom();

        this.game = null;
    });
}