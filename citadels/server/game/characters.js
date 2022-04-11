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

                debug("steals", game.stolenCharacter);
            }
        }
    },

    {
        name: 'Magicien',

        async action({ player, game }) {

            const choice = await game.ask(player)("get_magician", game.players);

            if (!choice) return;

            if (choice.exchange) { // Exchange

                const exchangedPlayer = game.players.find(p => p.login === choice.exchange);

                [player.hand, exchangedPlayer.hand] = [exchangedPlayer.hand, player.hand];

                debug("   ", player.login, "exchanges with", choice.exchange);

            } else if (choice.discard && choice.discard.length) { // Discard

                debug("changes", choice.discard.length, "cards");

                for (
                    const cardToRemoveIndex in choice.discard
                        .sort()
                        .reverse()
                ) {

                    game.deck.discard(player.hand.splice(cardToRemoveIndex, 1));
                    player.hand.push(game.deck.draw());
                }
            }
        }
    },

    {
        name: 'Roi',

        async action({ player, game }) {

            game.firstPlayerToPlay = player.login;

            getExtraGold(player, "YELLOW");
        },
    },

    {
        name: 'Eveque',

        async action({ player }) {

            getExtraGold(player, "BLUE");
        }
    },

    {
        name: 'Marchand',

        async action({ player }) {

            ++player.gold;

            getExtraGold(player, "GREEN");
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

            getExtraGold(player, "RED");

            const choice = await game.ask(player)("get_warlord", game.players);

            if (!choice) return;

            const attackedPlayer = game.players[choice.playerIndex];

            const attackedDistrict = attackedPlayer.districts[choice.districtIndex];

            if (!player.gold < attackedDistrict.price - 1) return;

            debug("destroys card", attackedDistrict.name, "of", attackedPlayer.login);

            player.gold -= attackedDistrict.price - 1;

            attackedPlayer.districts.splice(choice.district, 1);
        }
    }
];

function getExtraGold(player, color) {

    player.gold += player.districts.filter(d => d.color === colors[color])
        .length;
}