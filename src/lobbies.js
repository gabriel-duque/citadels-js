import './lobby.css';

const gameName = document.querySelector('meta[name="game-name"]')
  .content;


document.querySelectorAll('.lobby').forEach(lobbyElement => {
  attachListener(lobbyElement);
});

const createLobbyButton = document.querySelector('.create-lobby');

createLobbyButton.addEventListener('click', () => {

  postRequest('/create-lobby/' + gameName, response => {
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
  const lobbyId = document.createElement("p");
  const joinButton = document.createElement("button");

  lobbyElement.classList.add('lobby');

  lobbyId.innerHTML = lobby.lobbyId;
  joinButton.innerHTML = "Join lobby";
  joinButton.id = lobby.lobbyId;

  lobbyElement.appendChild(lobbyId);
  lobbyElement.appendChild(joinButton);
  document.body.appendChild(lobbyElement);

  attachListener(lobbyElement);

  return lobbyElement;
}

function attachListener(lobbyElement) {

  const button = lobbyElement.querySelector("button");

  button.addEventListener('click', () => {

    window.location = `/${gameName}-lobby-${button.id}`;
  });
}