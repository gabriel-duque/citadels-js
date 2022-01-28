import session from 'express-session';
import expressCookieParser from 'cookie-parser';

/* WITH MYSQL */
// import { createPool } from 'mysql';
// import mySQLStore from 'express-mysql-session';
/* -------- */

import Debug from 'debug';
const debug = Debug('app:session-store');

const EXPRESS_SID_KEY = 'connect.sid';


export default function createSessionStore({ COOKIE_SECRET, DB_CONFIG }) {

	debug(`Initializing session store`);

	/* WITH MYSQL */
	// const sessionStore = new (mySQLStore(session))({}, createPool(DB_CONFIG));

	/* WITHOUT MYSQL */
	const sessionStore = new session.MemoryStore();

	const expressSessionStore = session({
		store: sessionStore,
		resave: false,
		saveUninitialized: true,
		secret: COOKIE_SECRET,
		name: EXPRESS_SID_KEY
	});

	const cookieParser = expressCookieParser(COOKIE_SECRET);


	function sessionMiddleware(socket, { }, next) {

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

	const socketSession = {

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
	return {
		expressSessionStore,
		cookieParser,
		sessionMiddleware,
		socketSession
	}
}

function getSessionIdCookie(request) {

	return (
		request.secureCookies?.[EXPRESS_SID_KEY] ||
		request.signedCookies?.[EXPRESS_SID_KEY] ||
		request.cookies?.[EXPRESS_SID_KEY]
	);
}