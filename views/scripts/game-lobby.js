import 'styles/global.css';

const gameName = document.querySelector('meta[name="game-name"]')
  .content;


document.querySelectorAll('.lobby').forEach(lobbyElement => {
  attachListener(lobbyElement);
});

const createLobbyButton = document.querySelector('.create-room');

createLobbyButton.addEventListener('click', () => {

  postRequest(`./`, response => {
    renderLobby(response)
  })
});

function postRequest(route, onload) {

  const request = new XMLHttpRequest();
  request.open('POST', route);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();

  request.onerror = () => {
    console.log('error');
  }

  return request.onload = () => onload(JSON.parse(request.responseText));
}

function renderLobby(lobby) {

  const lobbyElement = document.createElement('div');
  const roomId = document.createElement("p");
  const joinButton = document.createElement("button");

  lobbyElement.classList.add('lobby');

  roomId.innerHTML = lobby.roomId;
  joinButton.innerHTML = "Join room";
  joinButton.id = lobby.roomId;

  lobbyElement.appendChild(roomId);
  lobbyElement.appendChild(joinButton);
  document.body.appendChild(lobbyElement);

  attachListener(lobbyElement);

  return lobbyElement;
}

function attachListener(lobbyElement) {

  const button = lobbyElement.querySelector("button");

  button.addEventListener('click', () => {

    window.location = `/${gameName}/${button.id}`;
  });
}