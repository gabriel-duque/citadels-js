import events from 'app/event-emmitter';

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

    addCard() {

        const card = document.createElement('div');

        card.className = "card player-card";

        this.view.hand.appendChild(card);

        return card;
    }

    buildDistrict(district) {

        this.view.coins.innerHTML -= district.price;
        this.view.points.innerHTML += district.value;

        const districtView = document.createElement('div');
        districtView.className = "card district player-district";
        districtView.innerHTML = district.name;

        this.view.districts.appendChild(districtView);
    }

    updatePoints(points) {

        this.view.points.innerText = points;
    }

    updateCoins(coins) {

        this.view.coins.innerText = coins;
    }
}

export class SelfPlayer extends Player {

    constructor(container, login, hand) {

        super(container, login);

        this.hand = hand;

        for (const card of hand) {

            this.addCard(card);
        }

        events.on("new_card", card => {

            this.addCard(card);
        });
    }

    addCard({ name, color }) {

        const card = super.addCard();

        card.className += ` card-${color}`;

        card.setAttribute('data-name', name);

        card.innerHTML = name;
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
            .forEach(card => {
                // todo check if enough gold to build
                this.proposeCard(card);
            });
    }

    proposeCard(cardView) {

        cardView.classList.add('highlight');

        cardView.addEventListener('click', choseCard.bind(this));

        function choseCard() {

            const name = cardView.getAttribute('data-name');

            const card = this.hand.find(c => c.name === name);

            events.emit('chose_district', card);

            cardView.removeEventListener('click', choseCard);
        }
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

        events.on("player_new_card", login => { // todo not here

            if (login === this.login) this.addCard();
        });
    }

    buildDistrict(district) {
        
        super.buildDistrict(district);

        this.removeCard();
    }

    removeCard() {

        const cardView = this.view.hand.querySelector(".card");

        if (cardView) {
            cardView.remove();
        } else {
            console.log(`No district to remove`);
        }
    }
}