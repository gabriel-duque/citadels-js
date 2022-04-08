import expressSession from 'express-session';
import cookieParser from 'cookie-parser';

/* UNCOMMENT WHEN USING MYSQL */
// import { createPool } from 'mysql';
// import mySQLStore from 'express-mysql-session';
/* -------- */

import Debug from 'debug';
const debug = Debug('app:session-store');


const EXPRESS_SID_KEY = 'connect.sid';


export default function createSessionStore(COOKIE_SECRET, DB_CONFIG) {

	const isMysql = typeof mySQLStore !== 'undefined';
	debug(`Creating session store with ${isMysql ? 'MySQL' : 'memory'}`);

	const sessionStore = isMysql ?
		new (mySQLStore(expressSession))({}, createPool(DB_CONFIG)) :
		new expressSession.MemoryStore();

	const parseCookie = cookieParser(COOKIE_SECRET);

	return {

		store: expressSession({
			store: sessionStore,
			resave: false,
			saveUninitialized: true,
			secret: COOKIE_SECRET,
			name: EXPRESS_SID_KEY
		}),

		middleware: function (req, _, next) {

			if (!req.headers.cookie) return next(new Error('No cookie transmitted'));

			parseCookie(req, _, parseError => {

				if (parseError) return next(new Error('Error parsing cookies'));

				const sessionIdCookie = getSessionIdCookie(req);

				sessionStore.load(sessionIdCookie, (error, session) => {

					if (error) return next(error);
					else if (!session) return next(new Error('Session load failed'));

					req.session = session;
					req.sessionId = sessionIdCookie;

					return next();
				});
			});
		},

		socket: {

			save(socket, sessionData) {

				debug("Saving session for:", socket.id, sessionData);

				Object.assign(socket.request.session, sessionData);

				socket.request.session.save();
			},


			remove(socket) {

				debug("Remove session data for: ", socket.id);

				for (const key in socket.request.session) {

					if (key !== 'cookie') {

						delete socket.request.session[key];
					}
				}

				socket.request.session.save();
			}

		}
	}
}

function getSessionIdCookie(request) {

	return (
		request.secureCookies?.[EXPRESS_SID_KEY] ||
		request.signedCookies?.[EXPRESS_SID_KEY] ||
		request.cookies?.[EXPRESS_SID_KEY]
	);
}