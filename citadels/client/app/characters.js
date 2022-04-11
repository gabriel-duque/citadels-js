import { socket } from "app/connection";

import { CharacterCard } from "app/card";

export default class Characters {

    collection = {};

    container = document.querySelector('.characters-container');

    constructor(characters) {

        this.characters = characters;

        characters.forEach((character, i) => {

            this.collection[character] = new CharacterCard(this.container, character);

            this.collection[character].view.setAttribute("data-index", i);
        });

        socket.on("chose_character", remaining_characters => {

            this.revealCharacters(remaining_characters, "pick");
        });

        socket.on("get_assassin", () => {

            const killableCharacters = this.characters
                .filter(c => c !== "assassin")
                .map(c => ({ name: c }));

            this.revealCharacters(killableCharacters, "kill");
        });
    }

    revealCharacters(characters, onClick) {

        for (const { name } of characters) {

            this.collection[name].setActive(onClick);
        }
    }
}