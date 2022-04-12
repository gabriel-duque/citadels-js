import { createCharacterCard } from "app/cards";


export default {

    
    container: document.querySelector('.characters-container'),


    init(characters) {

        characters.forEach((character, i) => {

            createCharacterCard(this.container, character, i);
        });


        this.killable = characters.filter((_, i) => i > 0)

        this.stealable = characters.filter((_, i) => i > 1);

        return this;
    },

    get(name) {

        return this.container.querySelector(`[data-name="${name}"]`);
    },

    highlight(name) {

        this.container.querySelectorAll('.character-card').forEach(card => {

            card.classList.remove('active');
        });

        this.get(name).classList.add('active');
    },

    inactivate(name) {

        this.get(name).classList.add('inactive');
    },

    kill(name) {

        this.get(name).classList.add('dead');
    },

    steal(name) {

        this.get(name).classList.add('stolen');
    },

    reset() {

        this.container.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('active');
            card.classList.remove('selectable');
            card.classList.remove('inactive');
            card.classList.remove('dead');
            card.classList.remove('stolen');
        });
    },


    propose(characters, resolve) {

        characters.forEach((name, index) => {

            const cardView = this.get(name);

            cardView.classList.add("selectable");

            cardView.addEventListener("click", selectCharacter.bind(this));

            function selectCharacter() {

                resolve(index);

                [...this.container.querySelectorAll(".selectable")]
                    .forEach(cardView => {

                        cardView.removeEventListener("click", selectCharacter);

                        cardView.classList.remove("selectable");
                    });
            }
        });

    }
}