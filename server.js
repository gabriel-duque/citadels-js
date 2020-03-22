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

//Routes to pages
app.get("/", function(request, response) {
  response.render("pages/gameindex.ejs");
});

const Citadels = require(__dirname + '/utils/citadels');
var players = {};
var logins = [
  'ShallowRed',
  'Bovary',
  'Roonie',
  'Bagu'
];




//execute on each connection
io.on('connection', function(socket) {

  socket.on("login_register", function(userinput) {
    clog(userinput.username);
    player = players[socket.id];
    player = {
      id: socket.id,
      username: userinput.username
    }

    clog("new player : " + player.username);
    logins.push(player.username);

    socket.emit("logged_in", {
        username: player.username,
        logins : logins
    });

    socket.broadcast.emit("newplayer", player.username);

    socket.on("userstartgame", function() {
      socket.emit("gamestart", "Game started");
      launchgame();
    })
  });

});

function launchgame() {
  if (logins.length == 5) {
    Citadels(logins);
  }
}
