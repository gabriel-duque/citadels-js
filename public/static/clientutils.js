function clog(e) {
  console.log(e)
};

var socket = io();
var username;
var readyflag = false;
var lgr = document.getElementById('login');
var startgame = document.getElementById('startgame');
var ready = document.getElementById('ready');
var logwindow = document.getElementById('logwindow');
var lobbywindow = document.getElementById('lobbywindow');
var gamewindow = document.getElementById('gamewindow');
var playerlist = document.getElementById('playerlist');
var players = [];

function newlobby(players) {
  players.forEach(function(username) {
    addplayertolobby(username);
  });
}

function addplayertolobby(username) {
  let li = document.createElement('li');
  playerlist.appendChild(li);
  li.innerHTML += username;
  li.style.background="lightpink";
  li.id = username;
};
