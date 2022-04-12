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

        this[name] ??= this.container.querySelector(`[data-name="${name}"]`);

        return this[name];
    },

    getCards(selector = '.character-card') {

        this[selector] ??= [...this.container.querySelectorAll(selector)];

        return this[selector];
    },


    highlight(name) {

        for (const card of this.getCards()) {

            card.classList.remove('active');

        }

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

        for (const card of this.getCards()) {

            card.classList.remove('active');
            card.classList.remove('selectable');
            card.classList.remove('inactive');
            card.classList.remove('dead');
            card.classList.remove('stolen');
        }
    },


    propose(characters, resolve) {

        characters.forEach((name, index) => {

            activate.call(this, this.get(name));

            function activate(card) {

                card.classList.add("selectable");

                card.addEventListener("click", selectCharacter.bind(this));
            }

            function selectCharacter() {

                resolve(index);

                this.getCards(".selectable")
                    .forEach(desactivate);
            }

            function desactivate(card) {

                card.classList.remove("selectable");

                card.removeEventListener("click", selectCharacter);
            }
        });

    }
}