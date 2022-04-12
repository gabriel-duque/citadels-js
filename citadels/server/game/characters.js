import { colors } from './deck.js';

import Debug from 'debug';
const debug = Debug("citadels:character");


export default [

    {
        name: 'Assassin',

        async action({ game, player }) {

            const choice = await game.ask(player)("get_assassin");

            if (choice === 0) return

            game.deadCharacter = game.characters[choice].name;

            game.emit("character_killed", game.deadCharacter);

        }
    },

    {
        name: 'Voleur',

        async action({ game, player }) {

            const choice = await game.ask(player)("get_thief");

            if (choice > 1 && (
                game.characters[choice].name !== game.deadCharacter
            )) {

                game.stolenCharacter = game.characters[choice];

                game.emit("character_stolen", game.stolenCharacter);
            }
        }
    },

    {
        name: 'Magicien',

        async action({ player, game }) {

            const choice = await game.ask(player)("get_magician", game.players);

            if (!choice) return;

            if (choice.exchange) {

                this.exchange({ player, game }, choice);

            } else if (choice.discard && choice.discard.length) {

                this.discard({ player, game }, choice);
            }
        },

        async exchange({ player, game }, choice) {

            const exchangedPlayer = game.players.find(p => p.login === choice.exchange);

            [player.hand, exchangedPlayer.hand] = [exchangedPlayer.hand, player.hand];

            game.emit("player_exchanged", player, exchangedPlayer);
        },

        async discard({ player, game }, choice) {

            const cardsToRemoveIndex = choice.discard.map(d =>
                player.hand.findIndex(c => c.name = d)
            );

            for (
                const cardToRemoveIndex in cardsToRemoveIndex
                    .sort()
                    .reverse()
            ) {

                game.deck.discard(player.hand.splice(cardToRemoveIndex, 1));

                player.hand.push(...game.deck.draw());
            }

            game.emit("player_discarded", player, cardsToRemoveIndex.length);

        }
    },

    {
        name: 'Roi',

        async action({ player, game }) {

            game.firstPlayerToPlay = player.login;

            getExtraGold(game, player, "YELLOW");
        },
    },

    {
        name: 'Eveque',

        async action({ game, player }) {

            getExtraGold(game, player, "BLUE");
        }
    },

    {
        name: 'Marchand',

        async action({ game, player }) {

            ++player.gold;

            game.emit("player_got_one_gold", player);

            getExtraGold(game, player, "GREEN");
        }
    },

    {
        name: 'Architecte',

        async action({ player, game }) {

            player.hand.push(...game.deck.draw(2));
        }
    },

    {
        name: 'Condottiere',

        async action({ player, game }) {

            getExtraGold(game, player, "RED");

            const choice = await game.ask(player)("get_warlord", game.players);

            if (!choice) return;

            const attackedPlayer = game.players.find(p => p.login === choice.player);

            const attackedDistrictIndex = attackedPlayer.districts.findIndex(d => d.name === choice.district);

            const attackedDistrict = attackedPlayer.districts[attackedDistrictIndex];

            const price = attackedDistrict.price - 1;

            if (player.gold < price) return;

            player.gold -= price;

            attackedPlayer.districts.splice(attackedDistrictIndex, 1);

            game.emit("player_destroyed_district", player, attackedPlayer, attackedDistrict, price);
        }
    }
];

function getExtraGold(game, player, color) {

    const amount = player.districts
        .filter(d => d.color === colors[color])
        .length;

    game.emit("extra_gold", player, color, amount);

    player.gold += amount
}