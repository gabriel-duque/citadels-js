function clog(e) {
  console.log(e)
}

//Dependencies
var express = require('express'),
  http = require('http'),
  path = require('path'),
  socketIO = require('socket.io'),
  ejsLint = require('ejs-lint'),

  app = express(),
  server = http.Server(app),
  io = socketIO(server),
  port = 100;

const Citadels = require(__dirname + '/utils/citadels');

// Set port and start server.
app.set('port', port);
server.listen(port, function() {
  console.log('Starting server on port ' + port);
});

//Set view engine
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

//Routes to client folders
app.use('/semantic', express.static('public/semantic'));
app.use('/static', express.static('public/static'));
app.use('/img', express.static('public/img'));

//Route to lobby
app.get("/", function(request, response) {
  response.render("pages/lobby.ejs");
});


var players = {};

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

//execute on each connection
io.on('connection', function(socket) {

  socket.on('userinlobby', function() {
    setuplobby(socket);
  });
  socket.on("userongame", function() {
    socket.emit("logins", logins);
  })
});

function setuplobby(socket) {
  //Add the player to lobby unless it's full
  socket.on("login_register", function(userinput) {
    trylogin(socket, userinput);
  });



  //Allow starting when all players are ready
  socket.on("localready", function(player) {
    updateready(socket, player);
  });

  app.get("/startgame", function(request, response) {
    response.render("pages/gameindex.ejs", {
      users: logins,
      user: players[socket.id].username
    });
  });

}

function trylogin(socket, userinput) {
  if (logins.length < 8) {
    addplayer(socket, userinput);
  } else {
    socket.emit("message", "Sorry, the lobby is full.")
  };
}

function addplayer(socket, userinput) {
  let player = players[socket.id] = {
    id: socket.id,
    username: userinput.username
  }

  clog("new player : " + player.username);
  logins.push(player.username);


  socket.emit("logged_in", {
    username: player.username,
    logins: logins,
    isready: isready
  });

  socket.broadcast.emit("newplayer", player.username);
}

function updateready(socket, player) {
  if (player.readyflag == true) {
    isready.push(player.username);
  } else {
    isready.splice(isready.indexOf(player.username), 1);
  };
  io.emit("globalready", isready);
  if (isready.length == logins.length) {
    launchgame(socket);
  }
}

function launchgame(socket) {
  if (logins.length > 3) {
    shuffle(logins);
    io.emit("startallowed");
    //Citadels(logins);
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
