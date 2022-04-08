class Player {

    constructor(container, name) {

        this.name = name;
        this.container = container;
        this.cards = [];

        this.hand = container.querySelector('.player-hand');
        this.login = container.querySelector('.player-name');
        this.points = container.querySelector('.player-points');
        this.money = container.querySelector('.player-money');
        this.districts = container.querySelector('.player-districts');
    }

    initialRender() {

        this.login.innerText = this.name;
    }

    addCard() {

        const cardView = document.createElement('div');
        cardView.className = "card player-card";

        this.hand.appendChild(cardView);

        return cardView;
    }

    removeCard() {
    }


    addDistrict(district) {

        const districtView = document.createElement('div');
        districtView.className = "card player-district";
        districtView.innerText = district;

        this.districts.appendChild(districtView);
    }

    removeDistrict() {
    }

    updatePoints(points) {

        this.points.innerText = points;
    }

    updateMoney(money) {

        this.money.innerText = money;
    }
}

export class SelfPlayer extends Player {

    constructor(container, name, hand) {

        super(container, name);

        this.initialRender(hand);
    }

    initialRender(hand) {

        super.initialRender();

        for (const card of hand) {

            this.addCard(card);
        }
    }

    addCard(card) {

        const cardView = super.addCard();

        cardView.className += ` card-${card.color}`;
        cardView.innerHTML = card.name;

        this.cards.push(card);
    }
}

export class OtherPlayer extends Player {

    constructor(container, name, handLength) {

        super(container, name);

        container.querySelector('.player-hand').innerHTML = '';
        container.classList.remove("self-player-container");
        document.body.appendChild(container);

        this.handLength = handLength;

        this.initialRender();
    }

    initialRender() {

        super.initialRender();

        for (let i = 0; i < this.handLength; i++) {

            this.addCard();
        }
    }
}