import { socket } from "app/connection";
import { VisibleDistrictCard } from "app/card";

export default class Modal {

    container = document.querySelector(".modal");

    coinBtn = this.container.querySelector('.chose-coin');

    cardBtn = this.container.querySelector('.chose-card');

    constructor() {

        socket.on("card_or_coin", () => {

            this.show();
        });

        this.coinBtn.addEventListener('click', () => {

            socket.emit("card_or_coin", "coin");
        });


        this.cardBtn.addEventListener('click', () => {

            socket.emit("card_or_coin", "card");
        });


        socket.on("chose_card", cards => {

            cards.forEach(this.proposeCard);
        });
    }

    proposeCard = (card, i) => {

        const cardView = new VisibleDistrictCard(this.container, card);

        cardView.addEventListener('click', () => {

            socket.emit("chose_card", i);

            [...this.container.querySelectorAll(".card")]
                .forEach(card => card.remove());
        });
    }

    show() {
        this.container.classList.add("active");
    }

    hide() {
        this.container.classList.remove("active");
    }

}