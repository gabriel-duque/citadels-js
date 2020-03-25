var gamewindow = document.getElementById('gamewindow');
var myplayerwindow = document.getElementById('myplayerwindow');
var playerswindow = document.querySelectorAll('.playerwindow');
var players;

socket.emit('userongame');

// Setup all players window
socket.on('logins', function(logins) {

  // Order other players in view relatively to active player
  let beforepos = [],
    afterpos = [],
    playerorder = [];

  logins.forEach(function(login) {
    if (logins.indexOf(username) - logins.indexOf(login) < 0) {
      beforepos.push(login);
    } else if (logins.indexOf(username) - logins.indexOf(login) > 0) {
      afterpos.push(login);
    }
    playerorder = beforepos.concat(afterpos);
  });

  // Set others name on top of each window
  for (var i = 1; i < logins.length; i++) {
    playerswindow[i - 1].id = 'player' + i;
    let playername = document.getElementById('player' + i).querySelector('.playername');
    playername.innerHTML = '<a>' + playerorder[i - 1] + '</a>';
  };

  // Setup active player window
  var mywindow = document.querySelector('.playerwindow:last-child');
  var myplayername = mywindow.querySelector('.playername');
  var mytop = mywindow.querySelector('.top');
  var mybottom = mywindow.querySelector('.bottom');
  var mycity = mywindow.querySelector('.city');
  var mydeck = mywindow.querySelector('.deck');
  var mymoney = mywindow.querySelector('.money');
  var myrole = mywindow.querySelector('.role');
  mywindow.id = 'player0';
  myplayername.innerHTML = '<a>' + username + '</a>';
  myplayerwindow.appendChild(mywindow);
  mytop.appendChild(mycity);
  mybottom.appendChild(mymoney);
  mybottom.appendChild(mydeck);
  mydeck.after(myrole);

})

function addcard(player) {
  let deck = player.querySelector('.deck')
  let card = document.createElement('div');
  card.className = 'card';
  deck.appendChild(card);
  card.addEventListener('click', function() {
    let cards = deck.querySelectorAll('.card')
    cards.forEach(function(card) {
      card.style.width = '30%';
    });
    this.style.width = '100%';
  })
};

function removecard(player) {
  let deck = player.querySelector('.deck')
  let card = document.querySelector('.card');
  deck.removeChild(card);
};

function playdistrict(player) {
  let city = player.querySelector('.city')
  let district = document.createElement('div');
  district.className = 'district';
  city.append(district);
};

function removedistrict(player) {
  let city = player.querySelector('.city')
  let district = document.querySelector('.district');
  city.removeChild(district);
};

function newscore(player, amount) {
  let score = player.querySelector('.score');
  let newscore = parseInt(score.innerHTML.split('>')[1].split('<')[0]) + amount;
  score.innerHTML = '<a>' + newscore + '</a>';
};

function newmoney(player, amount) {
  let money = player.querySelector('.money')
  let newmoney = parseInt(money.innerHTML.split('>')[1].split('<')[0]) + amount;
  money.innerHTML = '<a>' + newmoney + '</a>';
};

function revealrole(player) {
  let role = player.querySelector('.prole')
  role.style.background = 'lightgreen';
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
