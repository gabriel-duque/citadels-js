import { SelfPlayer, OtherPlayer } from 'app/players';

export default class Game {

    constructor({
        characters,
        deckLength,
        firstPlayerToPlay,
        isLastTurn,
        player,
        players
    }) {

        this.characters = characters;
        this.deckLength = deckLength;
        this.firstPlayerToPlay = firstPlayerToPlay;
        this.isLastTurn = isLastTurn;

        const container = document.querySelector('.player-container');

        this.player = new SelfPlayer(container, player.login, player.hand);

        this.players = [];

        for (const p of players) {

            if (p.login === player.login) continue;

            this.players.push(
                new OtherPlayer(container.cloneNode(true), p.login, p.handLength)
            );
        }

    }
}