var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	io.sockets.emit('newConnect','hi');
	console.log(io.sockets.clients());
  socket.on('boom', function (data) {
    io.sockets.emit('bam',{hell:"yeah"});
  });
});