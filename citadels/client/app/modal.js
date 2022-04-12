import { socket } from "app/connection";
import { VisibleDistrictCard } from "app/card";

export default class Modal {

    container = document.querySelector(".modal");


    coinOrCardContainer = this.container.querySelector(".modal-coin_or_card");

    coinBtn = this.coinOrCardContainer.querySelector('.chose-coin');

    cardBtn = this.coinOrCardContainer.querySelector('.chose-card');


    choseCardContainer = this.container.querySelector(".modal-chose_card");


    magicianContainer = this.container.querySelector(".modal-magician");

    exchangeBtn = this.magicianContainer.querySelector('.chose-exchange');

    discardBtn = this.magicianContainer.querySelector('.chose-discard');

    exchangeContainer = this.container.querySelector(".modal-magician-exchange");

    discardContainer = this.container.querySelector(".modal-magician-discard");

    exchangePlayersContainer = this.container.querySelector(".modal-magician-exchange-players");

    discardCardsContainer = this.container.querySelector(".modal-magician-discard-cards");


    warlordContainer = this.container.querySelector(".modal-warlord");

    warlordPlayersContainer = this.container.querySelector(".modal-warlord-players");

    warlordDistrictsContainer = this.container.querySelector(".modal-warlord-districts");



    constructor() {
    }

    show() {

        this.container.style.display = "block";
    }

    hide() {

        this.container.style.display = "none";
    }

    showCardOrCoin() {

        this.coinOrCardContainer.style.display = "block";
    }

    hideCardOrCoin() {

        this.coinOrCardContainer.style.display = "none";
    }

    showChoseCard() {

        this.choseCardContainer.style.display = "block";
    }

    hideChoseCard() {

        this.choseCardContainer.style.display = "none";
    }

    showMagician() {

        this.magicianContainer.style.display = "block";
    }

    hideMagician() {

        this.magicianContainer.style.display = "none";
    }

    showExchange(logins) {

        this.exchangeContainer.style.display = "block";

        this.exchangePlayersContainer.style.display = "block";

        for (const login of logins) {

            const btn = document.createElement("button");

            btn.innerHTML = login;

            this.exchangePlayersContainer.appendChild(btn);

            btn.addEventListener("click", () => {

                socket.emit("get_magician", { exchange: login });
            });
        }
    }

    hideExchange() {

        this.exchangeContainer.style.display = "none";

        this.exchangePlayersContainer.style.display = "block";
    }

    showDiscard(hand) {

        this.discardContainer.style.display = "block";

        this.discardCardsContainer.style.display = "block";

        for (const card of hand) {

            const cardView = card.cloneNode(true);

            this.discardCardsContainer.appendChild(cardView);

            cardView.addEventListener("click", () => {

                // todo handle several choices

                socket.emit("get_magician", { discard: [card.getAttribute("data-name")] });
            });
        }

    }

    hideDiscard() {

        this.discardContainer.style.display = "none";

        this.discardCardsContainer.style.display = "none";
    }

    showWarlord() {

        this.warlordContainer.style.display = "block";
    }

    hideWarlord() {

        this.warlordContainer.style.display = "none";
    }

    showWarlordPlayers(logins, getDistricts) {

        this.warlordPlayersContainer.style.display = "block";

        for (const login of logins) {

            const btn = document.createElement("button");

            btn.innerHTML = login;

            this.warlordPlayersContainer.appendChild(btn);

            btn.addEventListener("click", () => {

                this.hideWarlordPlayers();

                this.showWarlordDistricts(login, getDistricts(login));
            });

        }
    }

    hideWarlordPlayers() {

        this.warlordPlayersContainer.style.display = "none";
    }

    showWarlordDistricts(login, districts) {

        console.log(districts);


        this.warlordDistrictsContainer.style.display = "block";

        for (const district of districts) {

            const cardView = district.cloneNode(true);

            this.warlordDistrictsContainer.appendChild(cardView);

            cardView.addEventListener("click", () => {

                socket.emit("get_warlord", {
                    player: login,
                    district: district.getAttribute("data-name")
                });

                /* todo move this elsewhere */
                [...this.warlordDistrictsContainer.querySelectorAll(".card")]
                    .forEach(card => card.remove());
                
                [...this.warlordPlayersContainer.querySelectorAll("button")]
                    .forEach(b => b.remove());

                this.hideWarlordDistricts();
            });
        }
    }

    hideWarlordDistricts() {

        this.hide();

        this.warlordDistrictsContainer.style.display = "none";
    }


    proposeCard = (card, i) => {

        const cardView = new VisibleDistrictCard(this.choseCardContainer, card);

        cardView.addEventListener('click', () => {

            socket.emit("chose_card", i);

            [...this.choseCardContainer.querySelectorAll(".card")]
                .forEach(card => card.remove());
        });
    }
}