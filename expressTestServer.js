var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var id = 1;
var boom = 0;
var answers = {};
var ansId = 1;
var game = false;
var randInt = function(max){
  return Math.ceil(Math.random()*max);
};
var getProblem = function(level){
  if (level >= 0){
    level = 5;
  }
  var first = randInt(level);
  var second = randInt(level);
  var answer = first * second;
  answers[++ansId] = answer;
  return {
    problem: first + " x " + second + " = ",
    id:ansId
  };
};
var Player = function(id){
  this.level = 0;
  this.safe = false;
  this.id = id;
};
var Team = function(id){
  this.players = [];
  this.score = 0;
  this.id = id;
  this.safePlayers = 0;
};
var teams = [new Team(0), new Team(1)];
var players = {};
server.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.join(id++);
  players[id] = new Player(id);
  var team;
  var otherTeam;
  //2 team only solution :(
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
  if (game){
    socket.emit('newProb', getProblem(0));
  }
  if (teams[0].players.length > 1 && !game){
    game = true;
    newRound();
  }
  socket.on('submitAnswer', function (data) {
    console.log('answer->' + data.answer + ' correct: ' + answers[data.answerId]);
    if (data.answer && parseInt(data.answer) === parseInt(answers[data.answerId])){
      players[data.id].level++;
      var team = data.team;
      teams[team].score++;
      var otherTeam = data.otherTeam;
      //register a bite
      if (data.hit && players[data.hit].safe === false){
        io.sockets.emit('bite', {biter: data.id,bitten:data.hit});
        io.sockets.in(data.hit).emit('youwerebitten',data.id);
        players[data.hit].level--;
        players[data.hit].safe = true;
        teams[otherTeam].safePlayers++;
        teams[otherTeam].score--;
      }
      if (teams[team].score === 10){
        //game over
        teams[team].score = 0;
        teams[otherTeam].score = 0;
        io.sockets.in('team' + team).emit('gameOver',"WIN");
        io.sockets.in('team' + otherTeam).emit('gameOver',"LOSE");
        setTimeout(newRound,7000);
      } else {
        //let everyone know this player is safe for the round
        io.sockets.emit('safe',data.id);
        socket.emit('youaresafe');
        players[data.id].safe = true;
      }
      if (teams[0].safePlayers >= teams[0].players.length && teams[1].safePlayers >= teams[1].players.length){
        newRound();
      }
    } else {
      socket.emit('wrong');
    }
  });

  socket.on('attack', function(data){
    if (players[data].safe === true){
      socket.emit('newProb', getProblem(players[player].level));
    }
  });
});

var newRound = function(){
  console.log('newRound');
  io.sockets.emit('newRound');
  if (teams[0].players.length > teams[1].players.length){
    var length = teams[0].players.length;
  } else {
    var length = teams[1].players.length;
  }
  for (var i = 0 ; i < length ; i++){
    if (teams[0].players[i]){
      var player = teams[0].players[i];
      players[player].safe = false;
      io.sockets.in(player).emit('newProb', getProblem(players[player].level));
    }
    if (teams[1].players[i]){
      var player = teams[1].players[i];
      players[player].safe = false;
      io.sockets.in(player).emit('newProb', getProblem(players[player].level));
    }
  }
}