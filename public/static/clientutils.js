 var socket = io();

 function clog(e) {
  console.log(e)
};

socket.on('message', function(data) {
  clog(data);
});

socket.on('alert', function(data) {
  alert(data);
});
