import expressSession from 'express-session';
import expressCookieParser from 'cookie-parser';

import Debug from 'debug';
const debug = Debug('app:session-store');

/* WITH MYSQL */
// import { createPool } from 'mysql';
// import expressMySqlSessionStore from 'express-mysql-session';
// import { DB_CONFIG, COOKIE_SECRET } from '../server.config.js';
// const dbConnection = createPool(DB_CONFIG);
// const MySQLStore = expressMySqlSessionStore(expressSession);
// const sessionStore = new MySQLStore({}, dbConnection);
/* -------- */

/* WITHOUT MYSQL */
import { COOKIE_SECRET } from '../server.config.template.js';
const sessionStore = new expressSession.MemoryStore();
/* -------- */


const EXPRESS_SID_KEY = 'connect.sid';

export const expressSessionStore = expressSession({
	store: sessionStore,
	resave: false,
	saveUninitialized: true,
	secret: COOKIE_SECRET,
	name: EXPRESS_SID_KEY
});


export const cookieParser = expressCookieParser(COOKIE_SECRET);


export function sessionMiddleware(socket, { }, next) {

	if (!socket.request.headers.cookie) {
		return next(new Error('No cookie transmitted'));
	}

	cookieParser(socket.request, {}, parseError => {

		if (parseError) {
			return next(new Error('Error parsing cookies'));
		}

		const sessionIdCookie = getSessionIdCookie(socket.request);

		sessionStore.load(sessionIdCookie, (error, session) => {

			if (error) {
				return next(error);
			} else if (!session) {
				return next(new Error('Session load failed'));
			}

			socket.session = session;
			socket.sessionId = sessionIdCookie;

			return next();
		});
	});
};

function getSessionIdCookie(request) {

	return (
		request.secureCookies?.[EXPRESS_SID_KEY] ||
		request.signedCookies?.[EXPRESS_SID_KEY] ||
		request.cookies?.[EXPRESS_SID_KEY]
	);
}

export const socketSession = {

	save(socket, sessionData) {

		debug("Saving session for:", socket.id, sessionData);

		Object.assign(socket.session, sessionData);

		socket.session.save();
	},


	remove(socket) {

		debug("Remove session data for: ", socket.id);

		for (const key in socket.session) {

			if (key !== 'cookie') {

				delete socket.session[key];
			}
		}

		socket.session.save();
	}

}