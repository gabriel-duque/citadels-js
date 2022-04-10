import events from 'app/event-emmitter';

export default class Characters {

    collection = {};

    constructor(characters) {

        this.container = document.querySelector('.characters-container');

        for (const character of characters) {

            const card = document.createElement('div');

            card.className = "card character-card";

            card.innerHTML = character;

            this.container.appendChild(card);

            this.collection[character] = card;
        }

        events.on("reveal_remaining_characters", this.revealRemainingCharacters.bind(this));
    }

    get cards() {
        return Object.values(this.collection);
    }

    get activeCards() {

        return [...this.container.querySelectorAll(".active")];
    }

    revealRemainingCharacters(characters) {

        for (const { name } of characters) {

            this.collection[name].classList.add("active");
        }

        this.activeCards.forEach(card => {

            card.addEventListener("click", selectCharacter.bind(this));

            function selectCharacter() {

                const name = card.innerHTML;

                this.collection[name].classList.add("chosen");

                this.cards.forEach(c => {
                    c.classList.remove("active");
                });

                this.activeCards.forEach(c => {
                    c.removeEventListener("click", selectCharacter);
                });

                events.emit("chose_character", name);
            }
        });
    }
}