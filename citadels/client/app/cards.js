function createCard(container) {

    const card = document.createElement('div');

    card.classList.add("card");

    container.appendChild(card);

    return card;
}


export function createCharacterCard(container, name, index) {

    const card = createCard(container);

    card.classList.add("character-card");

    card.setAttribute("data-name", name);

    card.setAttribute("data-index", index);

    card.innerHTML = name;

    return card;
}


export function createDistrictCard(container, { name, color, value, price }) {

    const card = createCard(container);

    card.classList.add("district-card");

    card.classList.add(`card-${color}`);

    card.innerHTML = name;

    card.setAttribute("data-name", name);

    card.setAttribute("data-price", price);

    card.setAttribute("data-value", value);

    return card;
}