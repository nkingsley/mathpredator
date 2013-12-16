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
var teams = [new Team(0), new Team(1)];
var playerLevels = {};
server.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.join(id++);
  playerLevels[id] = 0;
  var team;
  var otherTeam;
	if (teams[1].players.length > teams[0].players.length){
	  team = teams[0].id;
    teams[0].players.push(id);
    otherTeam = teams[1].id;
	} else {
	  team = teams[1].id;
    teams[1].players.push(id);
    otherTeam = teams[0].id;
	}
  socket.emit('initialize', {id:id,team:team,otherTeam:otherTeam});
  socket.join('team' + team);
	io.sockets.emit('newConnect', [teams[0],teams[1]] );
  socket.on('boom', function (data) {
    playerLevels[data.id]++;
	  var team = data.team;
    console.log('team->' + team);
    teams[team].score++;
    var otherTeam = data.otherTeam;
    if (data.hit){
      io.sockets.emit('hit', {biter: data.id,bitten:data.hit});
      playerLevels[data.hit]--;
      teams[otherTeam].score--;
    }
  	if (teams[team].score === 10){
      //game over
  	  teams[team].score = 0;
  	  teams[otherTeam].score = 0;
      io.sockets.in('team' + team).emit('gameOver',"WIN");
  	  io.sockets.in('team' + otherTeam).emit('gameOver',"LOSE");
  	} else {
      //let everyone know this player is safe for the round
      io.sockets.emit('safe',data.id);
    }

  });
});