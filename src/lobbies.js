import './lobby.css';

console.log("aaa")

const createLobbyButton = document.querySelector('.create-lobby');

createLobbyButton.addEventListener('click', () => {

  // send request to server
  const request = new XMLHttpRequest();
  request.open('POST', '/lobbies');
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();

  request.onload = () => {
    const lobby = JSON.parse(request.responseText);
    console.log(lobby);
  }

  request.onerror = () => {
    console.log('error');
  }

});