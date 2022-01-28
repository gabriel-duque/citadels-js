import expressSessionStore from 'express-session';
import cookieParser from 'cookie-parser';

/* UNCOMMENT WHEN USING MYSQL */
// import { createPool } from 'mysql';
// import mySQLStore from 'express-mysql-session';
/* -------- */

import Debug from 'debug';
const debug = Debug('app:session-store');


const EXPRESS_SID_KEY = 'connect.sid';


export default function createSessionStore(COOKIE_SECRET, DB_CONFIG) {


	const isMySql = typeof mySQLStore !== 'undefined';
	debug(`Initializing session store using ${isMySql ? 'MySQL' : 'memory'}`);


	const store = expressSessionStore({
		store: isMySql ?
			new (mySQLStore(expressSessionStore))({}, createPool(DB_CONFIG)) :
			new expressSessionStore.MemoryStore(),
		resave: false,
		saveUninitialized: true,
		secret: COOKIE_SECRET,
		name: EXPRESS_SID_KEY
	});


	function middleware(socket, { }, next) {

		if (!socket.request.headers.cookie) {
			return next(new Error('No cookie transmitted'));
		}

		cookieParser(COOKIE_SECRET)(socket.request, {}, parseError => {

			if (parseError) {
				return next(new Error('Error parsing cookies'));
			}

			const sessionIdCookie = getSessionIdCookie(socket.request);

			store.load(sessionIdCookie, (error, session) => {

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

	return {
		store,
		middleware,
		socket: {

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
	}
}

function getSessionIdCookie(request) {

	return (
		request.secureCookies?.[EXPRESS_SID_KEY] ||
		request.signedCookies?.[EXPRESS_SID_KEY] ||
		request.cookies?.[EXPRESS_SID_KEY]
	);
}