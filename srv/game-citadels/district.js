import Debug from '../debug.config.js';

/* An enumeration for colors */
export const colors = {
  RED: 'Red',
  BLUE: 'Blue',
  GREEN: 'Green',
  PURPLE: 'Purple',
  YELLOW: 'Yellow',
};

/* A class to represent a district card */
export class District {

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
      Debug("game")('This is a hidden district.');
      
    else
      Debug("game")(this);
  }
}