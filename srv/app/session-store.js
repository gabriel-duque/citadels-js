import expressCookieParser from 'cookie-parser';
import { db, cookieSecret } from './server.config.js';

import expressSession from 'express-session';
import expressMySqlSessionStore from 'express-mysql-session';

import { createPool } from 'mysql';


const dbConnection = createPool(db);

const MySQLStore = expressMySqlSessionStore(expressSession);

const sessionStore = new MySQLStore({}, dbConnection);

const EXPRESS_SID_KEY = 'connect.sid';


export const expressSessionStore = expressSession({
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  secret: cookieSecret,
  name: EXPRESS_SID_KEY
});


export const cookieParser = expressCookieParser(cookieSecret);


export function sessionMiddleware(socket, {}, next) {

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

      socket.request.session = session;
      socket.request.sessionId = sessionIdCookie;

      return next();
    });
  });
};


function getSessionIdCookie(request) {

  return (
      request.secureCookies &&
      request.secureCookies[EXPRESS_SID_KEY]) ||
    (
      request.signedCookies &&
      request.signedCookies[EXPRESS_SID_KEY]) ||
    (
      request.cookies &&
      request.cookies[EXPRESS_SID_KEY]
    );
}