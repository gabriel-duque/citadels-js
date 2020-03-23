var gamewindow = document.getElementById('gamewindow');
var myplayerwindow = document.getElementById('myplayerwindow');
var playerswindow = document.querySelectorAll('.playerwindow');
var span = document.querySelector('span');
var usrname = span.innerHTML;
var players;
span.remove();

socket.emit("userongame");

socket.on("logins", function(logins) {

  let playerpos = logins.indexOf(usrname),
   beforepos = [],
   afterpos = [],
   playerorder = [];

  logins.forEach(function(login) {
    let diff = playerpos - logins.indexOf(login);
    if (diff < 0) {
      beforepos.push(login);
    } else if (diff > 0) {
      afterpos.push(login);
    }
    playerorder = beforepos.concat(afterpos);
  });

  for (var i = 1; i < logins.length; i++) {
    var player = {
      id: 'player' + i,
      name: playerorder[i - 1]
    };
    playerswindow[i - 1].id = player.id;
    let playername = document.getElementById(player.id).querySelector('.playername');
    playername.innerHTML = "<a>" + player.name + "</a>";
  };

  let mywindow = document.querySelectorAll(".playerwindow:last-child")[0];
  mywindow.id = 'player0';
  myplayerwindow.appendChild(mywindow);
  let myplayername = myplayerwindow.querySelector('.playername');
  myplayername.innerHTML = "<a>" + usrname + "</a>";

})

function addcard(player) {
  let deck = player.querySelector('.deck')
  let card = document.createElement("div");
  card.className = "card";
  deck.appendChild(card);
};

function removecard(player) {
  let deck = player.querySelector('.deck')
  let card = document.querySelector(".card");
  deck.removeChild(card);
};

function playdistrict(player) {
  let districts = player.querySelector('.districts')
  let district = document.createElement("div");
  district.className = "district";
  districts.append(district);
};

function removedistrict(player) {
  let districts = player.querySelector('.districts')
  let district = document.querySelector(".district");
  districts.removeChild(district);
};

function newscore(player, amount) {
  let score = player.querySelector('.score');
  let newscore = parseInt(score.innerHTML.split('>')[1].split('<')[0]) + amount;
  score.innerHTML = "<a>" + newscore + "</a>";
};

function newmoney(player, amount) {
  let money = player.querySelector('.money')
  let newmoney = parseInt(money.innerHTML.split('>')[1].split('<')[0]) + amount;
  money.innerHTML = "<a>" + newmoney + "</a>";
};

function revealrole(player) {
  let role = player.querySelector('.prole')
  role.style.background = "lightgreen";
};

////////////  For testing

var mytest1 = document.getElementById('mytest1');
var mytest2 = document.getElementById('mytest2');
var mytest3 = document.getElementById('mytest3');
var mytest4 = document.getElementById('mytest4');
var mytest5 = document.getElementById('mytest5');
var mytest6 = document.getElementById('mytest6');
var mytest7 = document.getElementById('mytest7');

mytest1.addEventListener('click', function() {
  addcard(player0);
});

mytest2.addEventListener('click', function() {
  removecard(player0);
});

mytest3.addEventListener('click', function() {
  playdistrict(player1);
});

mytest4.addEventListener('click', function() {
  removedistrict(player1);
});

mytest5.addEventListener('click', function() {
  newscore(player1, 3);
});

mytest6.addEventListener('click', function() {
  newmoney(player1, 5);
});

mytest7.addEventListener('click', function() {
  revealrole(player1);
});
