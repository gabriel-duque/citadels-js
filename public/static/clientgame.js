var socket = io();

function clog(e) {
  console.log(e)
};

var lgr = document.getElementById('Login_Register');
var startgame = document.getElementById('startgame');
var logwindow = document.getElementById('logwindow');
var lobbywindow = document.getElementById('v window');
var gamewindow = document.getElementById('gamewindow');
var playerlist = document.getElementById('playerlist');

lgr.addEventListener('click', function() {
  socket.emit("login_register", {
    username: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

var others = [];

socket.on("logged_in", function(data) {
  clog("Logged in with username : " + data.username);
  others = data.logins;
  clog("Players connected : " + others);
  newlobby(others);
  logwindow.style.display = "none";
  lobbywindow.style.display = "block";
});

socket.on("newplayer", function(username) {
  others.push(username);
  clog("New player : " + username);
  addplayertolobby(username);
});


startgame.addEventListener('click', function() {
  socket.emit("userstartgame", "start");
  lobbywindow.style.display = "none";
  gamewindow.style.display = "block";
});

//Receive data needed for initialization
socket.on('gamestart', function() {
  clog("Game started");
});

//Receive data from server and do shit (only sent to me)
socket.on('event1', function(data) {
  clog(data);
});

function newlobby(others) {
  others.forEach(function(username) {
    addplayertolobby(username);
  });
}

function addplayertolobby(username) {
  let li = document.createElement('li');
  playerlist.appendChild(li);
  li.innerHTML += username;
};
