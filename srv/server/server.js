import path from 'path';
import http from 'http';
import express from 'express';
import { Server } from "socket.io";

import Debug from '../debug.config.js';

import { port } from '../server.config.js';
import { cookieParser, session, sessionMiddleware, } from './session-store.js';

const debug = Debug('server');


const app = express();

const server = http.createServer(app);

const io = new Server(server);


server.listen(port, () => debug(`Server listening on port ${port}`));

const publicFolder = path.resolve('../dist');

app.use(express.static(publicFolder));


app.use(cookieParser);

app.use(session);


export default {

  io,

  /**
   * @param {{ publicPath: string; fileName: string; ioNamespace: string; }[]} routes
   */
  set routes(routes) {

    for (const { publicPath, fileName, ioNamespace } of routes) {

      app.get(publicPath, (_, res) => {
        res.sendFile(`${publicFolder}/${fileName}`)
      });

      io.of(ioNamespace)
        .use((socket, next) =>
          sessionMiddleware(socket, {}, next)
        );
    }
  }
}