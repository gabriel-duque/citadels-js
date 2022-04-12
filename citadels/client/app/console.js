export default class Console {

    container = document.querySelector(".console");

    messages = this.container.querySelector(".messages");

    button = this.container.querySelector(".toggle-expansion");

    open = false;

    constructor() {

        this.button.addEventListener("click", () => {

            this.open = !this.open;

            if (this.open) {
                this.button.innerHTML = "&#x25B2;";
                this.messages.classList.add("open");
            } else {
                this.button.innerHTML = "&#x25BC;";
                this.messages.classList.remove("open");
            }
        });
    }

    log(message) {

        if (this.lastMessage) {
            this.lastMessage.classList.remove("last-message");
        }

        this.lastMessage = document.createElement("p");

        this.lastMessage.className = "console-message last-message";

        this.lastMessage.innerHTML = message;

        this.messages.appendChild(this.lastMessage);

        if (this.open) {
            this.messages.scrollTop = this.messages.scrollHeight;
        }
    }
}