import Debug from "debug";
const debug = Debug("app:room");

export default class Room {


    players = {};


    constructor(GameRoom, ioNsp, roomId) {

        this.GameRoom = GameRoom;

        this.gameName = GameRoom.name;

        this.ioNsp = ioNsp;

        this.roomId = roomId;

        this.lobbyPath = `/${this.gameName}/${roomId}`;
        this.playPath = `/${this.gameName}/${roomId}/play`;
    }


    get room() {

        return this.ioNsp
            .to(this.roomId);
    }

    emit(...args) {
        this.room.emit(...args);
    }

    get sockets() {

        return [...this.room.adapter.sids.keys()]
            .map(sid => ([
                sid,
                this.ioNsp.sockets.get(sid)
            ])
            );
    }

    get logins() {

        return Object.values(this.players);
    }

    getSocketIdByLogin(login) {

        for (const socketId in this.players) {

            if (this.players[socketId] === login) return socketId;
        }
    }

    getSocketByLogin(login) {

        const socketId = this.getSocketIdByLogin(login);

        return this.ioNsp.sockets.get(socketId);
    }

    getLoginBySocketId(socketId) {

        return this.players[socketId];
    }


    onConnection(socket) {

        const type = socket.handshake.headers.referer.match(/\/play/) ? "play" : "lobby";

        debug(`New client ${socket.id} joined room ${this.roomId} of ${this.ioNsp.name} /${type}`);

        if (type === "lobby") this.onLobbyConnection(socket);

        else this.onPlayConnection(socket);

        socket.on('disconnect', () => {

            debug(`Client ${socket.id} left room ${this.roomId} of ${this.ioNsp.name} /${type}`);

            if (type === "lobby") this.onLobbyDisconnection(socket);

            else this.onPlayDisconnection(socket);

        });
    }


    onLobbyConnection(socket) {

        if (this.isUserLoggedIn(socket)) {

            this.handleExistingSession(socket);
        }

        /* Send already connected clients login to incoming one */
        socket.emit("player_joined", this.logins);

        socket.on('log_attempt', login => {

            /* Make sure logins and sockets ids are unique */
            for (const socketId in this.players) {

                const existingLogin = this.getLoginBySocketId(socketId);

                if (existingLogin === login) {

                    /* Prevent user from using someone else's login */
                    if (socketId !== socket.id) {

                        socket.emit('login_taken');
                    }

                    return;

                } else if (socket.id === socketId) {

                    this.room.emit("player_left", existingLogin);
                }
            }

            debug(`Binding login ${login} to client ${socket.id}`);

            this.players[socket.id] = login;

            /* Send incoming client login to connected ones */
            this.room.emit('player_joined', [login]);
        });

        socket.on("toggle_ready_state", ready => {

            // this.players[socket.id].ready = ready;

            const login = this.getLoginBySocketId(socket.id);

            debug(`Player ${login} is ${ready ? "" : "not "}ready to play`);

            this.room.emit('toggle_ready_state', { login, ready });
        });

        /*  Launch game when amount of desired players is reached */
        socket.on('room_complete', () => {

            /* Starts the game */
            debug(`Starting game of ${this.gameName} for room ${this.roomId}`);

            this.saveAllSessions();

            this.startGame();

            this.redirectAll(this.playPath);
        });
    }

    handleExistingSession(socket) {

        if (this.gameRoom?.isGameRunning) {

            this.redirect(socket, this.playPath);

            return;
        }

        this.ioNsp.session.remove(socket);
    }

    startGame() {

        this.gameRoom = new this.GameRoom(this.logins);

        this.gameRoom.sockets = { emit: this.emit.bind(this) };

        const delay = this.gameRoom.game.delay;

        this.gameRoom.game.ask = (player) => {

            return async (message, ...args) => {

                const ask = this.askClient.call(this, player, delay);

                const response = await ask(message, ...args);

                return (
                    response || this.gameRoom.game.askChampion(player, message, ...args)
                );
            };
        }


        this.gameRoom.closeRoom = this.close.bind(this);
    }

    close() {

        this.room.emit('redirect', this.lobbyPath);

        this.deleteAllSessions();

        this.players = {};
    }

    saveAllSessions() {

        for (const [socketId, socket] of this.sockets) {

            this.ioNsp.session.save(socket, {
                login: this.getLoginBySocketId(socketId)
            });
        }
    }

    deleteAllSessions() {

        for (const [_, socket] of this.sockets) {

            this.ioNsp.session.remove(socket);
        }
    }

    askClient(player, delay) {

        const socket = this.getSocketByLogin(player.login);

        return (message, ...args) => {

            return new Promise((resolve, reject) => {

                debug(`Asking ${player.login} for question: "${message}"`);

                socket.emit(message, ...args);

                setTimeout(() => {

                    debug(`${player.login} did not answer in time`);

                    resolve(null);

                }, delay)

                socket.on(message, answer => {

                    debug(`Received answer: ${answer}`);

                    socket.removeAllListeners(message);

                    resolve(answer);
                });
            });

        }
    }

    /* Remove a player from the lobby */
    onLobbyDisconnection(socket) {

        const login = this.getLoginBySocketId(socket.id);

        if (!login) return;

        debug(`Unbinding login ${login} to client ${socket.id}`);

        delete this.players[socket.id];

        socket.to(this.roomId).emit('player_left', login);
    }

    onPlayConnection(socket) {

        /* If no game is running, log player out */
        if (
            !this.gameRoom?.isGameRunning &&
            this.isUserLoggedIn(socket)
        ) {
            this.ioNsp.session.remove(socket);
        }

        /* If user is not logged in, redirects to lobby */
        if (!this.isUserLoggedIn(socket)) {

            this.redirect(socket, this.lobbyPath);

            return;
        }


        const { login } = socket.request.session;

        this.handlePreviousSocketBound(login);

        /* Bind socket id with player login */
        debug(`Binding login ${login} to client ${socket.id}`);
        this.players[socket.id] = login;

        socket.to(this.roomId).emit('player_joined', login);

        /* This player is ready to playi*/
        this.gameRoom.onHandshakeDone(socket, login);
    }

    onPlayDisconnection(socket) {

        socket.to(this.roomId).emit('player_left', socket.request.session.login);
    }

    handlePreviousSocketBound(login) {

        for (const socketId in this.players) {

            if (this.players[socketId] === login) {

                debug(`Unbinding login ${login} to client ${socketId}`);

                delete this.players[socketId];
            }
        }

    }

    isUserLoggedIn(socket) {

        const logged = socket?.request?.session?.login

        debug(`Client at ${this.gameName} is ${logged ? "" : "not "}logged in: ${socket.id}`);

        return logged;
    }

    redirect(socket, path) {

        debug(`Redirecting ${socket.id} to ${path}`);

        socket.emit('redirect', path);
    }

    redirectAll(path) {

        debug(`Redirecting every socket to ${path}`);

        this.room.emit('redirect', path);
    }
}