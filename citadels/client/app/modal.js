import events from 'app/event-emmitter';

export default class Modal {

    constructor() {

        this.container = document.querySelector(".modal");

        events.on("card_or_coin", () => {

            this.show();
        });

        const coinBtn = this.container.querySelector('.chose-coin');

        coinBtn.addEventListener('click', () => {

            events.emit("chose_card_or_coin", "coin");

            this.hide();
        });

        const cardBtn = this.container.querySelector('.chose-card');

        cardBtn.addEventListener('click', () => {

            events.emit("chose_card_or_coin", "card");

            this.hide();
        });


        events.on("chose_card", cards => {

            this.show();

            cards.forEach((card, i) => {

                console.log(card);
                

                const cardView = document.createElement("div");
                cardView.classList.add("card");
                cardView.innerHTML = card.name;
                this.container.appendChild(cardView);

                cardView.addEventListener('click', () => {
                    events.emit("card_chosen", i);

                    [...this.container.querySelectorAll(".card")]
                        .forEach(card => card.remove());

                    this.hide();
                });
            });
        });
    }

    show() {
        this.container.classList.add("active");
    }

    hide() {
        this.container.classList.remove("active");
    }

}