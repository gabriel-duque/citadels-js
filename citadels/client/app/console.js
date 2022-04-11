export default {

    nMessages: 0,

    container: document.querySelector(".console"),

    log(message) {

        if (this.nMessages > 6) {
            document.querySelector(".console-message:first-child").remove();
        }

        this.container.innerHTML += `<p class="console-message">${message}</p>`;

        this.nMessages++;
    }
}