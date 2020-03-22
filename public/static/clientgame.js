lgr.addEventListener('click', function() {
  socket.emit("login_register", {
    username: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

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
