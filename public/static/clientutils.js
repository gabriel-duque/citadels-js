var socket = io();

function clog(e) {
  console.log(e)
};

var lgr = document.getElementById('Login_Register');
var startgame = document.getElementById('startgame');
var logwindow = document.getElementById('logwindow');
var lobbywindow = document.getElementById('lobbywindow');
var gamewindow = document.getElementById('gamewindow');
var playerlist = document.getElementById('playerlist');

var others = [];

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
