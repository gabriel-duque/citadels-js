import Debug from '../debug.config.js';

const debug = Debug('session');

export default {

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