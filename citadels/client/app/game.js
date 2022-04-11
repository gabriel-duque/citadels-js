import { SelfPlayer, OtherPlayer } from 'app/players';

import Characters from 'app/characters';

import Console from 'app/console';

import Modal from 'app/modal';

import events from 'app/event-emmitter';

export default class Game {

    constructor({
        characters,
        player,
        logins
    }) {

        this.characters = new Characters(characters);

        this.console = new Console();

        this.modal = new Modal();

        const container = document.querySelector('.player-container');

        this.player = new SelfPlayer(container, player.login, player.hand);

        this.players = logins
            .filter(login =>
                login !== player.login
            )
            .map(login =>
                new OtherPlayer(container.cloneNode(true), login)
            );

        this.bindEvents();
    }

    getPlayer(login) {

        return this.player.login === login ?
            this.player :
            this.players.find(player => player.login === login);
    }

    bindEvents() {

        events.on("new_turn", firstPlayer => {
            
            this.console.log(`New turn, ${firstPlayer} plays first`);

            this.getPlayer(firstPlayer).view.container.style.outline = '3px solid #ff0000'
        });

        events.on("update_player_coins", (login, amount) => {

            events.emit("console", `${login} has chosen to get 2 gold`);
            
            this.getPlayer(login).updateCoins(amount);
        });

        events.on("chose_build_district", () => {
            this.player.highlightHand();
        });

        events.on("player_builds_district", (login, district) => {
            this.getPlayer(login).buildDistrict(district);
        });
    }
}
