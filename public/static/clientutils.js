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
