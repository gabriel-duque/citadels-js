import Debug from "debug";
const debug = Debug("app:game-room");

export default class GameRoom {

    players = {};

    constructor(Game, io, id) {

        this.Game = Game;

        this.io = io;

        this.id = id;

        this.lobbyPath = `/${Game.name}/${id}`;
        this.playPath = `/${Game.name}/${id}/play`;

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

            debug(`New client ${socket.id} connected at ${this.io.name} room ${this.id} /${type}`);

            if (type === "lobby") {
                this.onLobbyConnection(socket);
            } else {
                this.onPlayConnection(socket);
            }

            socket.on('disconnect', () => {

                debug(`Client ${socket.id} disconnected from ${this.io.name} room ${this.id} /${type}`);

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

            if (this.isGameRunning) {

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
            }

            this.players[socket.id] = login;

            /* Send incoming client login to connected ones */
            this.room.emit('player_joined', [login]);
        });

        socket.on("toggle_ready_state", ready => {

            // this.players[socket.id].ready = ready;

            this.room.emit('toggle_ready_state', {
                login: this.players[socket.id],
                ready
            });
        });

        /*  Launch game when amount of desired players is reached */
        socket.on('room_complete', () => {

            for (const [id, socket] of this.io.sockets) {

                this.io.session.save(socket, {
                    login: this.players[id]
                });
            }

            /* Starts the game */

            debug("Creating new game of:", this.Game.name);
            this.game = new this.Game(Object.values(this.players));

            this.publicGameState = this.getInitialPublicGameState();

            this.bindEvents();

            /* Redirects all players to the game */
            this.redirectAll(this.playPath);
        });
    }

    /* Remove a player from the lobby */
    onLobbyDisconnection(socket) {

        const login = this.players[socket.id];

        if (!login) return;

        delete this.players[socket.id];

        socket.to(this.id).emit('player_left', login);
    }

    onPlayConnection(socket) {

        /* If no game is running, log player out */
        if (!this.isGameRunning) {

            this.io.session.remove(socket);
        }

        /* If user is not logged in, redirects to lobby */
        if (!this.isUserLoggedIn(socket)) {

            this.redirect(socket, this.lobbyPath);

            return;
        }


        /* Bind socket id with player login */
        this.players[socket.id] = socket.session.login;

        socket.to(this.id).emit('player_joined', socket.session.login);

        /* This player is ready to playi*/
        this.onHandshakeDone(socket)
    }

    onPlayDisconnection(socket) {

        socket.to(this.id).emit('player_left', socket.session.login);
    }

    /* Check if user is logged in */
    isUserLoggedIn(socket) {

        const logged = socket?.session?.login

        debug(`Client at ${this.Game.name} is ${logged ? "" : "not "}logged in: ${socket.id}`);

        return logged;
    }

    redirect(socket, path) {

        debug(`Redirecting ${socket.id} to ${path}`);

        socket.emit('redirect', path);
    }

    redirectAll(path) {

        this.room.emit('redirect', path);
    }

}