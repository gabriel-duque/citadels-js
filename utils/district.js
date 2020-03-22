/* An enumeration for colors */
const colors = {
    RED: 'Red',
    BLUE: 'Blue',
    GREEN: 'Green',
    PURPLE: 'Purple',
    YELLOW: 'Yellow',
};

/* A class to represent a district card */
class District {
    constructor(price, value, color, name, description, image_path) {
        this.price = price;
        this.value = value;
        this.color = color;
        this.name = name;
        this.description = description;
        this.image_path = image_path;
    }

    render(hidden = false) {
        if (hidden)
            console.log('This is a hidden district.');
        else
            console.log(this);
    }
}

module.exports = {
    colors: colors,
    District: District
}
