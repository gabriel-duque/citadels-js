import { SelfPlayer, OtherPlayer } from 'app/players';

import Characters from 'app/characters';

import Console from 'app/console';

import Modal from 'app/modal';

import { socket } from "app/connection";

export default class Game {

    players = {};

    constructor({
        characters,
        player,
        logins
    }) {

        this.logins = logins;

        this.characters = new Characters(characters);

        this.console = new Console();

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

        socket.on("card_or_coin", () => {

            this.modal.show();

            this.modal.showCardOrCoin();
        });

        this.modal.coinBtn.addEventListener('click', () => {

            socket.emit("card_or_coin", "coin");
        });


        this.modal.cardBtn.addEventListener('click', () => {

            socket.emit("card_or_coin", "card");
        });


        socket.on("player_chose_coin", login => {

            this.console.log(`${login} has chosen to get 2 coins`);

            this.players[login].coins += 2;

            if (login !== this.player.login) return;

            this.modal.hide();

            this.modal.hideCardOrCoin();
        })

        socket.on("chose_card", cards => {

            this.modal.hideCardOrCoin();

            this.modal.showChoseCard();

            cards.forEach(this.modal.proposeCard);
        });


        socket.on("new_card", card => {

            this.modal.hide();

            this.modal.hideChoseCard();

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


        socket.on('get_magician', players => {

            this.modal.show();

            this.modal.showMagician();
        });

        this.modal.exchangeBtn.addEventListener('click', () => {

            this.modal.hideMagician();

            const logins = this.logins
                .filter(l => l !== this.player.login);

            this.modal.showExchange(logins);
        });

        socket.on("new_hand", hand => {

            [...this.modal.exchangePlayersContainer.querySelectorAll("button")]
                .forEach(b => b.remove());

            [...this.player.view.hand.querySelectorAll(".card")]
                .forEach(c => c.remove());

            for (const card of hand) {

                this.player.addCard(card);
            }

            this.modal.hideExchange();

            this.modal.hideDiscard();

            this.modal.hide();
        });

        socket.on("new_hand_length", (login, handLength) => {

            this.players[login].setHandLength?.(handLength);
        });


        this.modal.discardBtn.addEventListener('click', () => {

            [...this.modal.discardCardsContainer.querySelectorAll(".card")]
                .forEach(c => c.remove());

            this.modal.hideMagician();

            this.modal.showDiscard([...this.player.view.hand.querySelectorAll(".card")]);
        });

        socket.on("new_gold", login => {

            this.players[login].coins += 1;
        });


        socket.on("extra_gold", (login, amount) => {

            this.players[login].coins += amount;
        });


        socket.on("get_warlord", () => {

            this.modal.show();

            this.modal.showWarlord();

            const logins = this.logins
                .filter(l => l !== this.player.login);

            this.modal.showWarlordPlayers(logins, login => {
                return [...this.players[login].view.districts.querySelectorAll(".card")];
            });
        });

        socket.on("destroyed_district", (login, attackedPlayerLogin, attackedDistrict, price) => {

            this.players[login].coins -= price;

            this.players[attackedPlayerLogin].removeDistrict(attackedDistrict);
        });

    }
}
