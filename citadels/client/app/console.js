import events from 'app/event-emmitter';

export default class Console {

    nMessages = 0;

    constructor() {

        this.dom = document.querySelector(".console");

        events.on("console", message => this.log(message));
    }

    log(message) {

        if (this.nMessages > 6) {
            document.querySelector(".console-message:first-child").remove();
        }

        this.dom.innerHTML += `<p class="console-message">${message}</p>`;

        this.nMessages++;
    }
}