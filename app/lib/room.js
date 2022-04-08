import Debug from "debug";
const debug = Debug("app:room");

export default class Room {

    players = {};

    constructor(GameRoom, io, id) {

        this.GameRoom = GameRoom;

        this.gameName = GameRoom.name;

        this.io = io;

        this.id = id;

        this.lobbyPath = `/${this.gameName}/${id}`;
        this.playPath = `/${this.gameName}/${id}/play`;

        this.init();
    }

    get room() {

        return this.io
            .to(this.id);
    }

    init() {

        this.io.on('connection', socket => {

            if (socket.rooms.size > 1) return;

            socket.join(this.id);

            const type = socket.handshake.headers.referer.match(/\/play/) ? "play" : "lobby";

            debug(`New client ${socket.id} joined room ${this.id} of ${this.io.name} /${type}`);

            if (type === "lobby") {
                this.onLobbyConnection(socket);
            } else {
                this.onPlayConnection(socket);
            }

            socket.on('disconnect', () => {

                debug(`Client ${socket.id} left room ${this.id} of ${this.io.name} /${type}`);

                if (type === "lobby") {
                    this.onLobbyDisconnection(socket);
                } else {
                    this.onPlayDisconnection(socket);
                }
            });
        });
    }

    onLobbyConnection(socket) {

        /* Handle existing session */
        if (this.isUserLoggedIn(socket)) {

            if (this.gameRoom?.isGameRunning) {

                /* If game is still running, redirect to the game */
                this.redirect(socket, this.playPath);

                return;

            } else {

                /* If game is not running, remove unwanted login cookie */
                this.io.session.remove(socket);
            }
        }

        /* Send already connected clients login to incoming one */
        socket.emit("player_joined", Object.values(this.players));

        socket.on('log_attempt', login => {

            /* Make sure logins and sockets ids are unique */
            for (const socketId in this.players) {

                if (this.players[socketId] === login) {

                    /* Prevent user from using someone else's login */
                    if (socketId !== socket.id) {
                        socket.emit('login_taken');
                    }

                    return;
                }

                if (socket.id === socketId) {

                    this.room.emit("player_left", this.players[socketId]);
                }
            }

            debug(`Binding login ${login} to client ${socket.id}`);
            this.players[socket.id] = login;

            /* Send incoming client login to connected ones */
            this.room.emit('player_joined', [login]);
        });

        socket.on("toggle_ready_state", ready => {

            // this.players[socket.id].ready = ready;

            const login = this.players[socket.id];

            debug(`Player ${login} is ${ready ? "" : "not "}ready to play`);

            this.room.emit('toggle_ready_state', { login, ready });
        });

        /*  Launch game when amount of desired players is reached */
        socket.on('room_complete', () => {

            for (const [id, socket] of this.io.sockets) {

                this.io.session.save(socket, {
                    login: this.players[id]
                });
            }

            /* Starts the game */

            debug(`Starting game of ${this.gameName} for room ${this.id}`);

            this.gameRoom = new this.GameRoom(this.io, this.id, this.players);

            /* Redirects all players to the game */
            this.redirectAll(this.playPath);
        });
    }

    /* Remove a player from the lobby */
    onLobbyDisconnection(socket) {

        const login = this.players[socket.id];

        if (!login) return;

        debug(`Unbinding login ${login} to client ${socket.id}`);

        delete this.players[socket.id];

        socket.to(this.id).emit('player_left', login);
    }

    onPlayConnection(socket) {

        /* If no game is running, log player out */
        if (!this.gameRoom?.isGameRunning) {

            this.io.session.remove(socket);
        }

        /* If user is not logged in, redirects to lobby */
        if (!this.isUserLoggedIn(socket)) {

            this.redirect(socket, this.lobbyPath);

            return;
        }


        const { login } = socket.request.session;

        for (const socketId in this.players) {

            if (this.players[socketId] === login) {

                debug(`Unbinding login ${login} to client ${socketId}`);

                delete this.players[socketId];
            }
        }

        /* Bind socket id with player login */
        debug(`Binding login ${login} to client ${socket.id}`);
        this.players[socket.id] = login;

        socket.to(this.id).emit('player_joined', login);

        /* This player is ready to playi*/
        this.gameRoom.onHandshakeDone(socket)
    }

    onPlayDisconnection(socket) {

        socket.to(this.id).emit('player_left', socket.request.session.login);
    }

    /* Check if user is logged in */
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