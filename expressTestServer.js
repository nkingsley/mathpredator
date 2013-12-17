var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
app.use(express.static(__dirname + '/public'));

var id = 1;
var boom = 0;
var answers = {};
var ansId = 1;
var game = false;
var randInt = function(max){
  return Math.ceil(Math.random()*max);
};
var getProblem = function(level){
  if (level <= 4){
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
  this.players = {};
  this.score = 0;
  this.id = id;
  this.safePlayers = 0;
  this.size = 0;
};
var teams = [new Team(0), new Team(1)];
var players = {};
server.listen(process.env.PORT || 5000);


io.sockets.on('connection', function (socket) {
  socket.on('disconnect', function(){
    var team = players[socket.name].team;
    teams[team].size--;
    delete teams[team].players[socket.name];
    io.sockets.emit('disconnect', [teams[0],teams[1],players[socket.name]]);
    delete players[socket.name];
  });
	socket.join(++id);
  socket.name = id;
  players[id] = new Player(id);
  var team;
  var otherTeam;
	if (teams[1].size > teams[0].size){
	  team = teams[0].id;
    teams[0].players[id] = id;
    otherTeam = teams[1].id;
	} else {
	  team = teams[1].id;
    teams[1].players[id] = id;
    otherTeam = teams[0].id;
	}
  players[id].team = team;
  socket.emit('initialize', {id:id,team:team,otherTeam:otherTeam,players:players});
  socket.join('team' + team);
  teams[team].size++;
  //let all players have the current team status and new player object
	io.sockets.emit('newConnect', [teams[0],teams[1],players[id]] );
  if (game){
    socket.emit('newProb', getProblem(0));
  }
  if (id > 4 && !game){
    game = true;
    newRound();
  }
  socket.on('submitAnswer', function (data) {
    if (data.hit && players[data.hit].safe === true){
      //build out client support
      socket.emit('attackedSafePlayer', data.answer);
      return;
    }
    if (data.answer && parseInt(data.answer) === parseInt(answers[data.answerId])){
      delete answers[data.answerId];
      players[data.id].level++;
      var team = data.team;
      teams[team].score++;
      var otherTeam = data.otherTeam;
      io.sockets.emit('safe',data.id);
      players[data.id].safe = true;
      //register a bite
      if (data.hit && players[data.hit].safe === false){
        io.sockets.emit('bite', {biter: data.id,bitten:data.hit});
        io.sockets.in(data.hit).emit('youwerebitten',data.id);
        players[data.hit].level--;
        players[data.hit].safe = true;
        teams[otherTeam].score--;
      }
      if (teams[team].score === 10){
        //game over
        teams[team].score = 0;
        teams[otherTeam].score = 0;
        io.sockets.in('team' + team).emit('gameOver',"WIN");
        io.sockets.in('team' + otherTeam).emit('gameOver',"LOSE");
        setTimeout(newRound,7000);
      }
      var roundOver = true;
      for (var id in players){
        if (players[id].safe === false){
          roundOver = false;
          break;
        }
      }
      if (roundOver){
        newRound();
      }
    } else {
      socket.emit('wrong');
    }
  });

  socket.on('attack', function(data){
    if (players[data.id].safe === true && players[data.attack].safe === false){
      socket.emit('newProb', getProblem(players[data.id].level));
    }
  });
});

var newRound = function(){
  for (var id in players){
    players[id].safe = false;
  }
  io.sockets.emit('newRound',[teams[0],teams[1],players]);
  setTimeout(function(){
    for (var id in players){
      io.sockets.in(id).emit('newProb', getProblem(players[id].level));
    }
  }, 2000);
}