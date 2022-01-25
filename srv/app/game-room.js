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

    init() {

        this.io.on('connection', socket => {

            if (socket.rooms.size > 1) return;

            socket.join(this.id);

            debug(`New client connected at ${this.io.name} room ${this.id}: ${socket.id}`);

            this.onConnection(socket);

            socket.on('disconnect', () => {

                debug(`Client disconnected from ${this.io.name}: ${socket.id}`);

                this.onDisconnection(socket);
            });
        });
    }

    onConnection(socket) {

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

                /* Handle player changing name */
                if (socketId === socket.id) {

                    this.unRegister(socket);
                }
            }

            this.register(socket, login);

            /* Send incoming client login to connected ones */
            this.io
                .to(this.id)
                .emit('player_joined', [login]);
        });

    }

    /* Remove a player from the lobby */
    onDisconnection(socket) {

        // this.unRegister(socket.id);
    }


    register(socket, login) {

        this.players[socket.id] = login;

        this.io.session.save(socket, { login });

        debug(`Client registered in room ${this.id}:`, login, socket.id);
    }

    unRegister(socket) {

        const login = this.players[socket.id];

        if (!login) return;

        delete this.players[socket.id];

        this.io.session.remove(socket);

        debug(`Client unregistered from ${this.id}:`, login, socket.id);

        this.io
            .to(this.id)
            .emit('player_left', login);
    }

}