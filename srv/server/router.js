import path from 'path';
import serveStatic from 'serve-static';

import Debug from '../debug.config.js';
const debug = Debug('router');


const PUBLIC_FOLDER = path.resolve('../dist');

const SERVE_STATIC_OPTIONS = { index: false, extensions: ['html'], }


export default {


  getPublicPath(publicPath) {

    const folder = path.resolve(PUBLIC_FOLDER, publicPath);

    debug('Serving static folder:', folder);

    return serveStatic(folder, SERVE_STATIC_OPTIONS)
  },


  askForFile(fileName) {

    return (req, _, next) => {

      debug("Sending file", fileName, "on get request:", req.url);

      req.url = fileName;

      next();
    }
  },


  redirectAtRoot(req, res) {

    if (req.url.match("favicon.ico")) return;

    debug(`Route ${req.url} not found, redirecting to root`);
  }

}