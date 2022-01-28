import http from 'http';
import express from 'express';
import { Server } from "socket.io";
import createSessionStore from './session-store.js';

import Debug from 'debug';
const debug = Debug('app:server');

export default function createServer({ PORT, ...SERVER_CONFIG },) {

	const {
		expressSessionStore,
		cookieParser,
		sessionMiddleware,
		socketSession
	} = createSessionStore(SERVER_CONFIG);

	debug(`Initializing server`);

	const app = express()
		.set('view engine', 'ejs')
		.set('views', '../views')
		.use(cookieParser)
		.use(expressSessionStore);


	const httpServer = http
		.createServer(app)
		.listen(PORT, () =>
			debug(`Server listening on port ${PORT}`)
		);


	const io = new Server(httpServer);

	io.initNamespace = function (name) {

		if (this._nsps.has(name)) return;

		debug(`Initializing socket.io namespace: ${name}`);

		this.of(name)
			.use((socket, next) =>
				sessionMiddleware(socket, {}, next)
			);

		this.of(name).session = socketSession;

	};

	return {
		app,
		io
	};
}