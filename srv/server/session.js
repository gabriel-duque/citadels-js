import expressCookieParser from 'cookie-parser';
import config from '../config.js';

import expressSession from 'express-session';
import expressMySqlSession from 'express-mysql-session';

import {
  createPool
} from 'mysql';

const cookieParser = expressCookieParser(config.cookieSecret);

const connection = createPool(config.db);

const MySQLStore = expressMySqlSession(expressSession);

const sessionStore = new MySQLStore({}, connection);
// const sessionStore = new expressSession.MemoryStore();

const EXPRESS_SID_KEY = 'connect.sid';

const session = expressSession({
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  secret: config.cookieSecret,
  name: EXPRESS_SID_KEY
});

const wrap = middleware => (socket, next) =>
  middleware(socket, {}, next);

export default (app, io) => {

  app.use(cookieParser);
  app.use(session);

  io.of("/lobby").use(wrap(sessionMiddleware));
  io.of("/game").use(wrap(sessionMiddleware));

  function sessionMiddleware(socket, {}, next) {
    const req = socket.request;

    if (!req.headers.cookie)
      return next(new Error('No cookie transmitted.'));

    cookieParser(req, {}, parseErr => {

      if (parseErr)
        return next(new Error('Error parsing cookies.'));

      const sidCookie = getSessionId(req);

      sessionStore.load(sidCookie, (err, session) => {

        if (err)
          return next(err);

        else if (!session)
          return next(new Error('Session load failed '));

        req.session = session;
        req.sessionId = sidCookie;

        return next();
      });
    });
  };
};

const getSessionId = req => (
    req.secureCookies &&
    req.secureCookies[EXPRESS_SID_KEY]) ||
  (
    req.signedCookies &&
    req.signedCookies[EXPRESS_SID_KEY]) ||
  (
    req.cookies &&
    req.cookies[EXPRESS_SID_KEY]
  );