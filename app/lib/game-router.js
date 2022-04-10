import express from 'express';
import { v4 as uuid } from 'uuid';

import Router from './router.js';
import Room from './room.js';

import Debug from 'debug';
const debug = Debug('app:game-router');


const LOBBIES = {};


export function createLobby(gameName, GameRoom, io) {

	debug(`Creating lobby for game: ${gameName}`);

	io.initNamespace(`/${gameName}`);

	const lobby = LOBBIES[gameName] = {
		rooms: {},
		GameRoom,
		ioNsp: io.of(`/${gameName}`)
	};

	lobby.ioNsp.on('connection', socket => {

		const clientRoomId = socket.handshake.headers.referer
			.split(`${gameName}/`)[1]
			.replace("/play", "");
		
		if (!lobby.rooms[clientRoomId]) return;

		socket.join(clientRoomId);

		lobby.rooms[clientRoomId].onConnection(socket);
	});
}


export function createRouter(gameName) {

	const router = express.Router();

	router.route('/')
		.get(
			renderLobby(gameName)
		)
		.post(
			createRoom(gameName)
		);

	router.route('/:roomId')
		.get(
			checkRoomExists(gameName),
			renderRoom(gameName)
		);

	router.route('/:roomId/play')
		.get(
			checkRoomExists(gameName),
			Router.askForFile()
		);

	return router;
}

function renderLobby(gameName) {

	return (req, res, next) =>

		Router.render("lobby", {
			gameName,
			ids: getRoomsIds(gameName)
		})(req, res, next)
}


function createRoom(gameName) {

	return (_, res) => {

		const roomId = uuid();

		debug(`Creating new room of game ${gameName} with id ${roomId}`);

		const { rooms, GameRoom, ioNsp } = LOBBIES[gameName];

		rooms[roomId] = new Room(GameRoom, ioNsp, roomId);

		res.send(JSON.stringify({ roomId }));
	}
}

function renderRoom(gameName) {

	return Router.render("room", ({ params: { roomId } }) => ({
		gameName,
		roomId
	}));
}

function getRoomsIds(gameName) {

	return Object.keys(LOBBIES[gameName]?.rooms);
}


function checkRoomExists(gameName) {

	return ({ params: { roomId } }, res, next) => {

		debug(`Checking if room exists: ${roomId}`);

		if (!LOBBIES[gameName]?.rooms?.[roomId]) {

			debug(`No room of id ${roomId} found in ${gameName} lobby, redirecting`);

			res.redirect('/');

			return;
		}

		next();
	}
}