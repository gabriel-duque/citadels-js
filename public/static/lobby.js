var players = [],
 username,
 readyflag = false,
 login = document.getElementById('login'),
 startgame = document.getElementById('startgame'),
 ready = document.getElementById('ready'),
 logwindow = document.getElementById('logwindow'),
 lobbywindow = document.getElementById('lobbywindow'),
 playerlist = document.getElementById('playerlist');

login.addEventListener('click', function() {
  username = document.getElementById("userName").value;
  if (username.length > 3) {
    socket.emit("login_register", {
      username: username,
      pass: document.getElementById("Password").value
    });
  } else {
    alert("Pseudo trop court");
  }
});

ready.addEventListener('click', function() {
  if (readyflag == false) {
    readyflag = true;
    ready.innerHTML = "<a>Prêt !</a>";
  } else {
    readyflag = false;
    ready.innerHTML = "<a>Prêt ?</a>";
  };
  socket.emit("localready", {
    username: username,
    readyflag: readyflag
  });
});

startgame.addEventListener('click', function() {
  socket.emit("userstartgame", "start");
  lobbywindow.style.display = "none";
});

socket.on("logged_in", function(data) {

  clog("Logged in with username : " + data.username);
  players = data.logins;
  clog("Players connected : " + players);
  players.forEach(function(username) {
    addplayertolobby(username);
  });
  data.isready.forEach(function(player) {
    document.getElementById(player).style.background = "lightgreen";
  });

  document.getElementById(username).style.borderColor = "#e9e9e9";
  document.getElementById(username).style.outline = "4px solid #ae9f26";

  logwindow.style.display = "none";
  lobbywindow.style.display = "block";
});

socket.on("newplayer", function(username) {
  players.push(username);
  clog("New player : " + username);
  addplayertolobby(username);
});

socket.on("globalready", function(isready) {

  players.forEach(function(player) {
    document.getElementById(player).style.background = "lightpink";
  });

  isready.forEach(function(player) {
    document.getElementById(player).style.background = "lightgreen";
  });

  if (isready.length > 3 && isready.length >= players.length) {
    startgame.style.display = "inline-block";
  } else {
    startgame.style.display = "none";
  };
})

//Receive data needed for initialization
socket.on('gamestart', function() {
  clog("Game started");
});

function addplayertolobby(username) {
  let li = document.createElement('li');
  playerlist.appendChild(li);
  li.innerHTML += username;
  li.style.background = "lightpink";
  li.id = username;
};
