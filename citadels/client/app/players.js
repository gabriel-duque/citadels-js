class Player {

    constructor(container, login) {

        this.login = login;

        this.view = {
            container,
            login: container.querySelector('.player-login'),
            hand: container.querySelector('.player-hand'),
            districts: container.querySelector('.player-districts'),
            points: container.querySelector('.player-points'),
            money: container.querySelector('.player-money')
        };

        this.view.login.innerText = login;
    }

    addCard() {

        const card = document.createElement('div');

        card.className = "card player-card";

        this.view.hand.appendChild(card);

        return card;
    }

    addDistrict(card) {

        this.view.districts.appendChild(card);
    }

    updatePoints(points) {

        this.view.points.innerText = points;
    }

    updateGold(money) {

        this.view.money.innerText = money;
    }
}

export class SelfPlayer extends Player {

    constructor(container, login, hand) {

        super(container, login);

        for (const card of hand) {

            this.addCard(card);
        }
    }

    addCard({ name, color}) {

        const card = super.addCard();

        card.className += ` card-${color}`;

        card.innerHTML = name;
    }
}

export class OtherPlayer extends Player {

    handLength = 4;

    constructor(container, login) {

        super(container, login);

        container.querySelector('.player-hand').innerHTML = '';
        container.classList.remove("self-player-container");
        document.body.appendChild(container);

        for (let i = 0; i < this.handLength; i++) {

            this.addCard();
        }
    }
}