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

    launchGame() {

        debug("Creating new game of:", this.Game.name);

        this.players = Object.values(this.lobbyRoom.players);

        this.game = new this.Game(this.players);

        this.publicGameState = this.getInitialPublicGameState();

        this.bindEvents();
    }


    /* ------------ GAME CHILD ------------ */

    get sockets() {

        return this.io.sockets;
    }


    register(socket, login) {

        this.players[socket.id] = login;

        this.debug(`Client registered at ${this.io.name}:`, login, socket.id);
    }


    /* Remove socket id from players */
    unRegister(socketId) {

        const login = this.players[socketId];

        if (!login) return;

        delete this.players[socketId];

        this.debug(`Client unregistered from ${this.io.name}:`, login, socketId);
    }


    redirect(socket, path) {

        this.debug(`Redirecting ${socket.id} to ${path}`);

        socket.emit('redirect', path);
    }

    redirectAll(path) {

        this.nameSpace
            .to(this.id)
            //   .to(this.type)
            .emit('redirect', path);
    }


    /* Check if user is logged in */
    isUserLoggedIn(socket) {

        if (
            socket.request?.session?.logged &&
            socket.request?.session?.login
        ) {

            this.debug(`Client at ${this.nameSpace.name} is logged in: ${socket.id}`);

            return true;
        }

        this.debug(`Client at ${this.nameSpace.name} is not logged in: ${socket.id}`);
    }

    /* ------------ GAME LOBBY ------------ */


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

        /* Check if player login is already stored in session */
        if (this.checkExistingSession(socket)) return;

        /* Send already connected clients login to incoming one */
        socket.emit("player_joined_lobby", Object.values(this.players));

        /* Send incoming client login to connected ones */
        socket.on('player_log_attempt', login => this.register(socket, login));

        /*  Launch game when amount of desired players is reached */
        socket.on('room_complete', () => {

            this.moveOnToGame();
        });
    }

    /* Remove a player from the lobby */
    onDisconnection(socket) {

        this.unRegister(socket.id);
    }


    /*  Launch game when amount of desired players is reached */
    moveOnToGame() {

        /* Save login cookies */
        this.saveLoginsInCookie();

        /* Starts the game */
        this.launchGame();

        /* Redirects all players to the game */
        this.redirectAll(this.parentRoom.playPath);
    }


    /* Save login in cookies */
    saveLoginsInCookie() {

        for (const [id, socket] of this.sockets) {

            this.session.save(socket, {
                logged: true,
                login: this.players[id]
            });
        }
    }


    /* Add a player to the lobby */
    register(socket, login) {

        /* Make sure logins and sockets ids are unique */
        if (!this.makeSureCredsAreUnique(socket, login)) return;

        super.register(socket, login);

        /* Inform clients that a player joined the lobby */
        this.nameSpace
            .to(this.id)
            .to(this.type)
            .emit('player_joined_lobby', [login]);
        // this.nameSpace.to(this.type).emit('player_joined_lobby', [login]);
    }


    /* Unregister player and inform other clients */
    unRegister(socketId) {

        if (!this.players[socketId]) return;

        this.nameSpace
            .to(this.id)
            .to(this.type)
            .emit('player_left_lobby', this.players[socketId]);
        // this.nameSpace.to(this.type).emit('player_left_lobby', this.players[socketId]);

        super.unRegister(socketId);
    }


    /* Handle existing session */
    checkExistingSession(socket) {

        if (!this.isUserLoggedIn(socket)) return;

        if (this.isGameRunning) {

            /* If game is still running, redirect him to the game */
            this.redirect(socket, this.parentRoom.playPath);

            return true
        }

        /* If game is not running, remove unwanted login cookie */
        this.session.remove(socket);
    }

    makeSureCredsAreUnique(socket, login) {

        for (const socketId in this.players) {

            if (this.players[socketId] === login) {

                /* Prevent user from using someone else's login */
                if (socketId !== socket.id) {
                    socket.emit('login_taken');
                }

                /* Do nothing if same player used same name */
                return;
            }

            /* Handle player changing name */
            if (socketId === socket.id) {

                this.unRegister(socketId);
            }
        }

        return true;
    }

        /* ------------ GAME PLAY ------------ */

        onConnection(socket) {

            if (!socket.rooms.has("play")) {
        
              return;
            }
        
            /* If no game is running, log player out */
            if (!this.isGameRunning) {
        
              this.session.remove(socket);
            }
        
            /* If user is not logged in, redirects to lobby */
            if (!this.isUserLoggedIn(socket)) {
        
              this.redirect(socket, this.parentRoom.lobbyPath);
        
              return;
            }
        
            /* Bind socket id with player login */
            this.register(socket, socket.request.session.login);
        
            /* This player is ready to playi*/
            this.parentRoom.onHandshakeDone(socket)
          }
        
          /* Inform players that someone left, do not unregister player as he might reconnect */
          onDisconnection(socket) {
        
            this.nameSpace.to(this.type)
              .emit('player_left_game', socket.id);
          }
        
        
          /* Bind socket id with player login */
          register(socket, login) {
        
            /* make sure login is unique (eg. if player refreshes) */
            this.makeSureLoginIsUnique(login);
        
            super.register(socket, login);
          }
        
        
          makeSureLoginIsUnique(login) {
        
            for (const socketId in this.players) {
        
              if (this.players[socketId] === login) {
        
                this.unRegister(socketId);
              }
            }
          }
}