 var socket = io();

 function clog(e) {
  console.log(e)
};

//Receive data from server and do shit (only sent to me)
socket.on('message', function(data) {
  clog(data);
});
