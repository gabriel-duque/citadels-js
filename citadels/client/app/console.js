export default {


    open: false,


    container: document.querySelector(".console"),


    init() {

        this.messages = this.container.querySelector(".messages");

        this.button = this.container.querySelector(".toggle-expansion");

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

        return this;
    },


    log(message) {

        this.lastMessage?.classList.remove("last-message");

        this.lastMessage = document.createElement("p");

        this.lastMessage.className = "console-message last-message";

        this.lastMessage.innerHTML = message;

        this.messages.appendChild(this.lastMessage);

        if (!this.open) return;

        this.messages.scrollTop = this.messages.scrollHeight;
    }
}