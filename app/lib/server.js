import http from 'http';
import express from 'express';
import { Server } from "socket.io";
import createSessionStore from './session-store.js';

import Debug from 'debug';
const debug = Debug('app:server');


export default function createServer({ PORT, COOKIE_SECRET, DB_CONFIG }) {

	debug(`Initializing server`);

	const session = createSessionStore(COOKIE_SECRET, DB_CONFIG);

	const app = express()
		.set('view engine', 'ejs')
		.set('views', '../views')
		.use(session.store);


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
				session.middleware(socket, {}, next)
			);

		this.of(name).session = session.socket;

	};

	return { app, io };
}