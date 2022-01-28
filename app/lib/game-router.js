import express from 'express';
import { v4 as uuid } from 'uuid';

import Router from './router.js';
import Room from './room.js';

import Debug from 'debug';
const debug = Debug('app:game-router');


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


const lobbies = {};


export function createLobby(gameName, GameRoom, io) {

	debug(`Creating lobby for game: ${gameName}`);

	io.initNamespace(`/${gameName}`);

	lobbies[gameName] = {
		rooms: {},
		GameRoom,
		io: io.of(`/${gameName}`)
	};
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

		const { rooms, GameRoom, io } = lobbies[gameName];

		rooms[roomId] = new Room(GameRoom, io, roomId);

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

	return Object.keys(lobbies[gameName]?.rooms);
}


function checkRoomExists(gameName) {

	return ({ params: { roomId } }, res, next) => {

		debug(`Checking if room exists: ${roomId}`);

		if (!lobbies[gameName]?.rooms?.[roomId]) {

			debug(`No room of id ${roomId} found in ${gameName} lobby, redirecting`);

			res.redirect('/');

			return;
		}

		next();
	}
}