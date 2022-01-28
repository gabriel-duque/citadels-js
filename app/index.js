import { init } from './lib/app.js';

import GAME_ROOMS from './games.config.js';

import * as SERVER_CONFIG from './server.config.js';


init(GAME_ROOMS, SERVER_CONFIG);