var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var id = 1;
var boom = 0;
var getProblem = function(level){
  return level;
}

var Team = function(id){
  this.players = [];
  this.score = 0;
  this.id = id;
}
var teams = [new Team(1), new Team(2)];
var playerLevels = {};
server.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.join(id++);
  socket.emit('initialize', id);
  playerLevels[id] = 0;
  var team;
	if (teams[0].players.length > team[1].players.length){
	  team = team[0].id;
    teams[0].players.push(id);
	} else {
	  team = team[1].id;
    teams[1].players.push(id);
	}
  socket.join('team' + team);
	io.sockets.emit('newConnect', [team[0],team[1]] );
  socket.on('boom', function (data) {
    playerLevels[data.id]++;
	  var team = data.team;
    teams[team].score ++;
    var otherTeam = data.otherTeam;
    if (data.hit){
      io.sockets.in(data.hit).emit('hit', data.id);
      playerLevels[data.hit]--;
      teams[otherTeam].score--;
    }
	  io.sockets.emit('bam', data.id );
  	if (team[team].score === 10){
      //game over
  	  team[team].score = 0;
  	  team[otherTeam].score = 0;
      io.sockets.in('team' + team).emit('gameOver',"WIN");
  	  io.sockets.in('team' + otherTeam).emit('gameOver',"LOSE");
  	} else {
      //let everyone know this player is safe for the round
      io.sockets.emit('safe',data.id);
      
    }

  });
});