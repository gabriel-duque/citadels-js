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
    new Character('Voleur', ''),
    new Character('Magicien', ''),
    new Character('Roi', ''),
    new Character('Eveque', ''),
    new Character('Marchand', ''),
    new Character('Architecte', ''),
    new Character('Condottiere', '')
];

module.exports = characters;
