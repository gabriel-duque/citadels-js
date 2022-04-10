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
        console.log(login);
        
        return this.player.login === login ?
            this.player :
            this.players.find(player => player.login === login);
    }

    bindEvents() {

        events.on("update_player_coin", (login, amount) => {

            events.emit("console", `${login} has chosen to get 2 gold`);

            this.getPlayer(login).updateGold(amount);
        });
    }
}
