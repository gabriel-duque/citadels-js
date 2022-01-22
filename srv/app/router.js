import path from 'path';
import serveStatic from 'serve-static';

import Debug from 'debug';
const debug = Debug('app:router');


const PUBLIC_FOLDER = path.resolve('../dist');

const SERVE_STATIC_OPTIONS = { index: false, extensions: ['html'], }

const SSR_FOLDER = 'pages';

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

  render(fileName, locals) {

    return (req, res) => {

      if (typeof locals === 'function') {
        
        locals = locals(req.url);
      }

      debug("Rendering page", fileName);

      res.render(`${SSR_FOLDER}/${fileName}`, locals);
    }
  },


  redirectAtRoot(req, res) {

    if (req.url.match("favicon.ico")) return;

    debug(`Route ${req.url} not found, redirecting to root`);
  }

}