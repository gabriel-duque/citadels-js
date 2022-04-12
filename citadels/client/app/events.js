export default function bindEvents(socket, game) {


    const { modal, players: { player, players }, characters } = game;

    const log = game.console.log.bind(game.console);


    socket.on("message", log);


    socket.on("new_turn", firstPlayerLogin => {

        log(`New turn, ${firstPlayerLogin} plays first`);

        game.players.highlight(firstPlayerLogin);

        characters.reset();
    });


    socket.on("player_to_chose_character", login => {

        game.players.highlight(login);

        log(`${login} is choosing a character`);
    });


    socket.on("reveal_character", (login, character) => {

        log(`- ${character} was chosen by ${login}`);

        game.players.highlight(login);

        characters.highlight(character);
    });


    socket.on("character_not_used", (character) => {

        log(`- ${character} is not used`);

        characters.highlight(character);

        characters.inactivate(character);
    });


    socket.on("character_is_dead", character => {

        log(`- ${character} is dead`);

        characters.kill(character);
    });


    socket.on("player_got_stolen", (login, character) => {

        log(`${login} got stolen as ${character}`);

        characters.steal(character);
    });


    socket.on("card_or_coin", () => {

        modal.show();

        modal.showCardOrCoin();
    });

    
    modal.coinBtn.addEventListener('click', () => {

        socket.emit("card_or_coin", "coin");
    });


    modal.cardBtn.addEventListener('click', () => {

        socket.emit("card_or_coin", "card");
    });


    socket.on("player_chose_coin", login => {

        log(`${login} has chosen to get 2 coins`);

        players[login].coins += 2;

        if (login !== player.login) return;

        modal.hideCardOrCoin();
    })

    socket.on("chose_card", cards => {

        modal.showChoseCard();

        cards.forEach((card, i) => {

            modal.proposeCard(card, i, i => {

                socket.emit("chose_card", i);
            })
        });
    });


    socket.on("new_card", card => {

        modal.hide();

        modal.hideChoseCard();

        player.addCardToHand(card);
    });


    socket.on("player_new_card", login => {

        players[login].cardCount += 1;
    });


    socket.on("chose_build_district", amountAllowed => {

        player.proposeCards(amountAllowed, name => {

            socket.emit("chose_build_district", name);
        });
    });


    socket.on('player_builds_district', (login, district) => {

        players[login].buildDistrict(district);
    });


    socket.on("chose_character", remaining_characters => {

        characters.propose(remaining_characters, index => {

            socket.emit("chose_character", index);
        });
    });


    socket.on("get_assassin", () => {

        characters.propose(characters.killable, index => {

            socket.emit("get_assassin", index + 1);
        });
    });


    socket.on("get_thief", () => {

        characters.propose(characters.stealable, index => {

            socket.emit("get_thief", index + 2);
        });
    });


    socket.on('get_magician', () => {

        modal.showMagician();
    });


    modal.exchangeBtn.addEventListener('click', () => {

        modal.showExchange(
            game.players.othersLogins,
            choice => socket.emit("get_magician", choice)
        );
    });


    socket.on("get_warlord", () => {

        modal.showWarlordPlayers(
            game.players.othersLogins,
            login => players[login].copyDistricts(),
            choice => socket.emit("get_warlord", choice)
        );
    });


    socket.on("new_hand", hand => {

        player.newHand(hand);

        modal.resetExchange();
    });


    socket.on("new_hand_length", (login, handLength) => {

        players[login].cardCount &&= handLength;
    });


    modal.discardBtn.addEventListener('click', () => {

        modal.showDiscard(player.copyHand(), discardedCards => {

            socket.emit("get_magician", { discard: discardedCards });
        });
    });


    socket.on("new_gold", login => {

        players[login].coins += 1;
    });


    socket.on("extra_gold", (login, amount) => {

        players[login].coins += amount;
    });


    socket.on("destroyed_district", (login, attackedPlayerLogin, attackedDistrict, price) => {

        players[login].coins -= price;

        players[attackedPlayerLogin].removeDistrict(attackedDistrict);
    });

}