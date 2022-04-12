import { createDistrictCard } from "app/cards";

export default {


    players: {},


    selfContainer: document.querySelector('.self-player-container'),

    otherContainer: document.querySelector('.player-container:not(.self-player-container)'),


    init(player, logins) {

        for (const login of logins) {

            if (login === player.login) {

                this.player =
                    this.players[login] =
                    new SelfPlayer(this.selfContainer, login, player.hand)

            } else {

                this.players[login] =
                    new OtherPlayer(this.otherContainer.cloneNode(true), login)
            }
        }

        this.othersLogins = logins.filter(login => login !== player.login)

        this.otherContainer.remove();

        return this;
    },


    highlight(activeLogin) {

        for (const login in this.players) {

            this.players[login].container
                .classList[login === activeLogin ? "add" : "remove"]("active");
        }
    }
}


class Player {

    constructor(container, login) {

        this.login = login;

        container.querySelector('.player-login').innerText = login;


        this.container = container;

        this.districts = container.querySelector('.player-districts');

        this.counters = {
            points: container.querySelector('.player-points'),
            coins: container.querySelector('.player-coins')
        };

        this.points = 0;

        this.coins = 2;
    }

    set points(points) {
        this.counters.points.innerHTML = points;
    }

    set coins(coins) {
        this.counters.coins.innerHTML = coins;
    }

    get points() {
        return parseInt(this.counters.points.innerHTML, 10);
    }

    get coins() {
        return parseInt(this.counters.coins.innerHTML, 10);
    }

    buildDistrict(district) {

        this.coins -= district.price;
        this.points += district.value;

        createDistrictCard(this.districts, district);
    }

    removeDistrict(name) {

        const district = this.districts.querySelector(`[data-name="${name}"]`);

        this.points -= district.getAttribute("data-value");

        district.remove();
    }
}


class SelfPlayer extends Player {

    constructor(container, login, hand) {

        super(container, login);

        this.hand = this.container.querySelector('.player-hand');

        for (const card of hand) {

            this.addCardToHand(card);
        }
    }

    addCardToHand(card) {

        createDistrictCard(this.hand, card);
    }

    removeCardFromHand(name) {

        const cardView = this.hand.querySelector(`.card[data-name="${name}"]`);

        if (cardView) cardView.remove();

        else console.log(`${name} not found in hand`);
    }

    newHand(hand) {

        this.hand.innerHTML = "";

        for (const card of hand) {

            this.addCardToHand(card);
        }
    }

    copyHand() {

        return [...this.hand.querySelectorAll(".card")];
    }

    buildDistrict(district) {

        super.buildDistrict(district);

        this.removeCardFromHand(district.name);
    }

    proposeCards(amountAllowed, resolve) {

        [...this.hand.querySelectorAll(".card")]
            .filter(cardView =>
                parseInt(cardView.getAttribute("data-price"), 10) <= this.coins
            )
            .forEach(cardView => {

                cardView.classList.add('highlight');

                cardView.addEventListener('click', choseCard.bind(this));

                function choseCard() {

                    const name = cardView.getAttribute('data-name');

                    resolve(name);

                    [...this.hand.querySelectorAll(".card")]
                        .forEach(card => card.classList.remove("highlight"));

                    cardView.removeEventListener('click', choseCard);
                }
            });
    }
}

class OtherPlayer extends Player {


    constructor(container, login) {

        super(container, login);

        this.counters.cards = this.container.querySelector('.player-card-count');

        document.body.appendChild(container);

        this.cardCount = 4;
    }

    set cardCount(amount) {
        this.counters.cards.innerHTML = amount;
    }

    get cardCount() {
        return parseInt(this.counters.cards.innerHTML, 10);
    }

    buildDistrict(district) {

        super.buildDistrict(district);

        this.cardCount -= 1;
    }

    copyDistricts() {

        return [...this.districts.querySelectorAll(".card")];
    }
}