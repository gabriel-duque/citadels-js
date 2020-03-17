/* This class represents a Character card */
class Character {
    constructor(name, image_path) {
        this.name = name;
        this.image_path = image_path;
    }

    render(hidden=false) {
        if (hidden)
            console.log("This is a hidden character card.");
        else
            console.log(this);
    }
};

/* An aray for the different characters */
const characters = [
    new Character('Assassin', ''),
    new Character('Thief', ''),
    new Character('Magician', ''),
    new Character('King', ''),
    new Character('Bishop', ''),
    new Character('Merchant', ''),
    new Character('Architect', ''),
    new Character('Warlord', '')
];

module.exports = characters;
