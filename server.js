function clog(e) {
  console.log(e)
}

// Dependencies
var express = require('express'),
  http = require('http'),
  path = require('path'),
  socketIO = require('socket.io'),
  ejsLint = require('ejs-lint'),
  session = require('express-session'),

  app = express(),
  server = http.Server(app),
  io = socketIO(server),
  port = 100;

// Set port and start server.
app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

//Routes to client folders
app.use('/semantic', express.static('public/semantic'));
app.use('/static', express.static('public/static'));
app.use('/img', express.static('public/img'));

// Create sessions to follow players after redirection
app.use(session({
  secret: 'somerandomcharacters',
  resave: true,
  saveUninitialized: true
}))

//get requests properly
app.use(express.urlencoded());
app.use(express.json());

const Citadels = require(__dirname + '/utils/citadels');

var players = [],
  sesslist = [],
  isshuffled = false;

var logins = [
  'Bovary',
  'Roonie',
  'Bagu'
];

var isready = [
  'Bovary',
  'Roonie',
  'Bagu'
];

// var logins = [];
// var isready = [];

// Send player to the lobby when connecting
app.get('/', function(request, response) {
  response.render('pages/lobby');
});

// Generate a unique html file for each player when game starts
app.get('/game', function(request, response) {
  let username;
  sesslist.forEach(function(player) {
    if (player.sessid == request.session.id) {
      username = player.name;
    }
  });
  shuffle(logins);
  response.render('pages/gameindex.ejs', {
    users: logins,
    username: username
  });
});

// Retrieve player name after game started with session ID
app.post('/', function(request, response) {
  const myplayer = {
    name: request.body.user.name,
    sessid: request.session.id
  }
  sesslist.push(myplayer)
})

//execute on each connection
io.on('connection', function(socket) {

  socket.on('login_register', function(userinput) {
    if (logins.length < 7) {
      logplayer(userinput, socket)
    } else {
      socket.emit('alert', 'sorry, lobby is already full')
    }
  })

  socket.on('localready', function(player) {
    allowstart(player)
  })

  socket.on('userongame', function() {
    socket.emit('logins', logins)
  })
})

function logplayer(userinput, socket) {
  logins.push(userinput.username);
  socket.emit('logged_in', {
    username: userinput.username,
    logins: logins,
    isready: isready
  })
  socket.broadcast.emit('newplayer', userinput.username)
}

// Get if all players are ready, allow game starting if so
function allowstart(player) {
  if (player.readyflag == true) {
    isready.push(player.username)
  } else {
    isready.splice(isready.indexOf(player.username), 1)
  }
  io.emit('globalready', isready)
  if (isready.length == logins.length && logins.length > 3) {
    io.emit('startallowed')
    //Citadels(logins);
  }
}

// Shuffle the order of player, only once before game starts
function shuffle(array) {
  if (isshuffled == false) {
    let curI = array.length,
      tempV, randI;
    while (0 !== curI) {
      randI = Math.floor(Math.random() * curI);
      curI -= 1;
      tempV = array[curI];
      array[curI] = array[randI];
      array[randI] = tempV;
    }
    isshuffled = true;
    clog('shuffled');
    return array
  }
}
