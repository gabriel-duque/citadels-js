import { createDistrictCard } from "app/cards";

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

        this.hide();

        this.coinOrCardContainer.style.display = "none";
    }

    showChoseCard() {

        this.hideCardOrCoin();

        this.choseCardContainer.style.display = "block";
    }

    hideChoseCard() {

        this.choseCardContainer.style.display = "none";
    }

    showMagician() {

        this.show();

        this.magicianContainer.style.display = "block";
    }

    hideMagician() {

        this.magicianContainer.style.display = "none";
    }

    showExchange(logins, resolve) {

        this.hideMagician();

        this.exchangeContainer.style.display = "block";

        this.exchangePlayersContainer.style.display = "block";

        for (const login of logins) {

            const btn = document.createElement("button");

            btn.innerHTML = login;

            this.exchangePlayersContainer.appendChild(btn);

            btn.addEventListener("click", () => {

                resolve({ exchange: login });
            });
        }
    }

    hideExchange() {

        this.exchangeContainer.style.display = "none";

        this.exchangePlayersContainer.style.display = "block";
    }

    resetExchange() {

        this.hideExchange();

        this.hideDiscard();

        this.hide();

        this.exchangePlayersContainer.innerHTML = "";
    }

    showDiscard(hand, resolve) {

        this.resetDiscard();

        this.hideMagician();

        this.discardContainer.style.display = "block";

        this.discardCardsContainer.style.display = "block";

        for (const card of hand) {

            const cardView = card.cloneNode(true);

            this.discardCardsContainer.appendChild(cardView);

            cardView.addEventListener("click", () => {

                // todo handle several choices
                const discardedCards = [card.getAttribute("data-name")];

                resolve(discardedCards);
            });
        }

    }

    hideDiscard() {

        this.discardContainer.style.display = "none";

        this.discardCardsContainer.style.display = "none";
    }

    resetDiscard() {

        this.discardCardsContainer.innerHTML = "";
    }

    showWarlord() {

        this.warlordContainer.style.display = "block";
    }

    hideWarlord() {

        this.warlordContainer.style.display = "none";
    }

    showWarlordPlayers(logins, getDistricts, resolve) {

        this.show();

        this.showWarlord();

        this.warlordPlayersContainer.style.display = "block";

        for (const login of logins) {

            const btn = document.createElement("button");

            btn.innerHTML = login;

            this.warlordPlayersContainer.appendChild(btn);

            btn.addEventListener("click", () => {

                this.hideWarlordPlayers();

                this.showWarlordDistricts(login, getDistricts(login), resolve);
            });

        }
    }

    hideWarlordPlayers() {

        this.warlordPlayersContainer.style.display = "none";
    }

    showWarlordDistricts(login, districts, resolve) {


        this.warlordDistrictsContainer.style.display = "block";

        for (const district of districts) {

            const cardView = district.cloneNode(true);

            this.warlordDistrictsContainer.appendChild(cardView);

            cardView.addEventListener("click", () => {

                resolve({
                    player: login,
                    district: district.getAttribute("data-name")
                });

                /* todo move this elsewhere */

                this.warlordDistrictsContainer.innerHTML = "";

                this.warlordPlayersContainer.innerHTML = "";

                this.hideWarlordDistricts();
            });
        }
    }

    hideWarlordDistricts() {

        this.hide();

        this.warlordDistrictsContainer.style.display = "none";
    }


    proposeCard = (card, i, resolve) => {

        const cardView = createDistrictCard(this.choseCardContainer, card);

        cardView.addEventListener('click', () => {

            resolve(i);

            this.choseCardContainer.innerHTML = "";
        });
    }
}