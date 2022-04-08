import io from 'socket.io-client';
import events from 'app/event-emmitter';

export const socket = io("/citadels");

socket.on('redirect', path => {
    window.location = path;
});

socket.on("initial_game_state", state => {
    
    events.emit("initial_game_state", state);
});