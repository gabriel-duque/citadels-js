import { SelfPlayer, OtherPlayer } from 'app/players';

import Characters from 'app/characters';

import console from 'app/console';

import Modal from 'app/modal';

import { socket } from "app/connection";

export default class Game {

    players = {};

    constructor({
        characters,
        player,
        logins
    }) {

        this.characters = new Characters(characters);

        this.console = console;

        this.modal = new Modal();

        const container = document.querySelector('.player-container');

        this.player = new SelfPlayer(container, player.login, player.hand);

        for (const login of logins) {
            this.players[login] = login === player.login ?
                this.player :
                new OtherPlayer(container.cloneNode(true), login)
        }

        this.bindEvents();
    }

    highlightPlayer(login) {

        for (const l in this.players) {

            this.players[l][l === login ? "highlight" : "unhighlight"]();
        }
    }


    bindEvents() {

        socket.on("message", this.console.log.bind(this.console));

        socket.on("new_turn", firstPlayerLogin => {

            this.console.log(`New turn, ${firstPlayerLogin} plays first`);

            this.highlightPlayer(firstPlayerLogin);
        });

        socket.on("reveal_character", (login, character) => {

            this.console.log(`- ${character} was chosen by ${login}`);

            this.highlightPlayer(login);

            // this.highlightCharacter(character);
        });

        socket.on("player_chose_coin", login => {

            this.console.log(`${login} has chosen to get 2 coins`);

            this.modal.hide();

            this.players[login].coins += 2;
        });

        socket.on("new_card", card => {

            this.modal.hide();

            this.player.addCard(card);
        });

        socket.on("player_new_card", login => {

            this.players[login].addCard();
        });

        socket.on("chose_build_district", amountAllowed => {

            this.player.highlightHand(amountAllowed);
        });

        socket.on('player_builds_district', (login, district) => {

            this.players[login].buildDistrict(district);
        });
    }
}
