import { socket } from "app/connection";

export class Card {

    constructor(container) {

        this.container = container;

        this.view = document.createElement('div');

        this.view.classList.add("card");

        container.appendChild(this.view);
    }
}

export class CharacterCard extends Card {

    constructor(container, character) {

        super(container);

        this.view.classList.add("character-card");

        this.view.innerHTML = character;
    }

    setActive(onClick) {

        this.view.classList.add("active");

        if (onClick === "pick") {

            this.view.addEventListener("click", this.selectCharacter);

        } else if (onClick === "kill") {

            this.view.addEventListener("click", this.killCharacter);
        }
    }

    selectCharacter = () => {

        const name = this.view.innerHTML;

        this.setChosen();

        this.desactivateCards();

        socket.emit("chose_character", name);
    }

    setChosen() {
        this.view.classList.add("chosen");
    }


    desactivateCards(onClick) {

        [...this.container.querySelectorAll(".active.card")]
            .forEach(cardView => {
                cardView.removeEventListener("click", onClick);
                cardView.classList.remove("active");
            });
    }


    killCharacter = () => {

        const index = parseInt(this.view.getAttribute("data-index"), 10);

        this.desactivateCards(this.killCharacter);

        socket.emit("get_assassin", index);
    }


    setInactive() {

        this.view.classList.remove("active");
    }

}

export class HiddenDistrictCard extends Card {

    constructor(container) {

        super(container);

        this.view.classList.add("district-card");
    }
}

export class VisibleDistrictCard extends HiddenDistrictCard {

    constructor(container, card) {

        super(container);

        this.view.setAttribute("data-name", card.name);

        this.view.classList.add(`card-${card.color}`);

        this.view.innerHTML = card.name;

        return this.view;
    }
}