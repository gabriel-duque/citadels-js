import events from 'app/event-emmitter';

export default class Modal {

    constructor() {

        this.dom = document.querySelector(".modal");

        events.on("coin_or_gold", () => {

            this.show();
        });

        const coinBtn = this.dom.querySelector('.chose-coin');

        coinBtn.addEventListener('click', () => {

            events.emit("chose_coin_or_gold", "coin");

            this.hide();
        });

        const cardBtn = this.dom.querySelector('.chose-card');

        cardBtn.addEventListener('click', () => {

            events.emit("chose_coin_or_gold", "card");

            this.hide();
        });
    }

    show() {
        this.dom.classList.add("active");
    }

    hide() {
        this.dom.classList.remove("active");
    }

}