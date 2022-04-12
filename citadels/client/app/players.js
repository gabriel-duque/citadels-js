import { socket } from "app/connection";

import { HiddenDistrictCard, VisibleDistrictCard } from "app/card";

class Player {

    constructor(container, login) {

        this.login = login;

        this.view = {
            container,
            login: container.querySelector('.player-login'),
            hand: container.querySelector('.player-hand'),
            districts: container.querySelector('.player-districts'),
            points: container.querySelector('.player-points'),
            coins: container.querySelector('.player-coins')
        };

        this.view.login.innerText = login;
    }

    set points(points) {
        this.view.points.innerHTML = points;
    }

    set coins(coins) {
        this.view.coins.innerHTML = coins;
    }

    get points() {
        return parseInt(this.view.points.innerHTML, 10);
    }

    get coins() {
        return parseInt(this.view.coins.innerHTML, 10);
    }

    buildDistrict(district) {

        this.coins -= district.price;
        this.points += district.value;

        new VisibleDistrictCard(this.view.districts, district);
    }

    removeDistrict(name) {
            
            const district = this.view.districts.querySelector(`[data-name="${name}"]`);

            this.points -= district.getAttribute("data-value");
    
            district.remove();
    }

    highlight() {
        this.view.container.classList.add("active");
    }

    unhighlight() {
        this.view.container.classList.remove("active");
    }
}

export class SelfPlayer extends Player {

    constructor(container, login, hand) {

        super(container, login);

        for (const card of hand) {

            this.addCard(card);
        }
    }

    addCard(card) {

        new VisibleDistrictCard(this.view.hand, card);
    }

    buildDistrict(district) {

        super.buildDistrict(district);

        this.removeCard(district.name);
    }

    removeCard(name) {

        const cardView = this.view.hand.querySelector(`.card[data-name="${name}"]`);

        if (cardView) {
            cardView.remove();
        } else {
            console.log(`${name} not found in hand`);
        }
    }

    highlightHand() {

        [...this.view.hand.querySelectorAll(".card")]
            .filter(card =>
                parseInt(card.getAttribute("data-price"), 10) <= this.coins
            )
            .forEach(card => {
                this.proposeCard(card);
            });
    }

    proposeCard(cardView) {

        cardView.classList.add('highlight');

        cardView.addEventListener('click', choseCard.bind(this));

        function choseCard() {

            [...this.view.hand.querySelectorAll(".card")]
                .forEach(card => card.classList.remove("highlight"));

            const name = cardView.getAttribute('data-name');

            socket.emit("chose_build_district", name);

            cardView.removeEventListener('click', choseCard);
        }
    }
}

export class OtherPlayer extends Player {

    constructor(container, login) {

        super(container, login);

        container.querySelector('.player-hand').innerHTML = '';
        container.classList.remove("self-player-container");
        document.body.appendChild(container);

        this.setHandLength(4);
    }

    setHandLength(length) {

        this.handLength = length;

        [...this.view.container.querySelectorAll(".card")].forEach(card => {
            card.remove();
        });

        for (let i = 0; i < this.handLength; i++) {

            this.addCard();
        }
    }

    addCard() {

        new HiddenDistrictCard(this.view.hand);
    }

    removeCard() {

        const cardView = this.view.hand.querySelector(".card");

        if (cardView) {
            cardView.remove();
        } else {
            console.log(`No district to remove`);
        }
    }

    buildDistrict(district) {

        super.buildDistrict(district);

        this.removeCard();
    }
}