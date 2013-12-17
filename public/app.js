angular.module('mathPredator', ['socket-io'])
.controller('mainControl', function($scope, socket) {
    // On connect, server sends player and team data.
    socket.on('initialize', function(data) {
      $scope.id = data.id;
      $scope.team = data.team;
      $scope.otherTeam = data.otherTeam;
      $scope.players = data.players;
    }).bindTo($scope);
    //update for any other player to disconnect, server will provide new team data
    socket.on('disconnect',function(data){
      $scope.teams = [data[0],data[1]];
      delete $scope.players[data[2].id];
    }).bindTo($scope);
    socket.on('safe', function (data) {
      if ($scope.id === data){
        $scope.message = 'Correct!  Pick Someone To attack.';
        $scope.problem = '';
      }
      $scope.players[data].safe = true;
      $scope.players[data].level++;
    }).bindTo($scope);
    socket.on('newConnect', function(data){
      $scope.teams = [data[0],data[1]];
      $scope.players[data[2].id] = data[2];
    }).bindTo($scope);
    socket.on('gameOver', function(data){
      $scope.message = data;
    }).bindTo($scope);
    socket.on('newProb', function(data){
      $scope.message = 'Go!';
      $scope.problem = data.problem;
      $scope.pData = data;
    }).bindTo($scope);
    socket.on('bite', function(data){
      if ($scope.idToBite === data.bitten){
        $scope.idToBite = null;
      }
      $scope.players[data.bitten].safe = true;
      $scope.players[data.bitten].level--;
      $scope.players[data.biter].level++;
    }).bindTo($scope);
    socket.on('youwerebitten', function(data){
      $scope.bitten = true;
      $scope.message = 'you were bitten by ' + data + '.  Get revenge soon!';
    }).bindTo($scope);
    socket.on('newRound', function(data){
      $scope.bitten = false;
      $scope.message = '';
      $scope.problem = 'New Round!';
      $scope.teams = [data[0],data[1]];
      $scope.players = data[2];
    }).bindTo($scope);
    socket.on('wrong', function(data){
      $scope.message = wrong;
    }).bindTo($scope);
    socket.on('attackedSafePlayer', function(data){
      $scope.answerInput = data;
      $scope.message = 'rats... they\'re safe.  Pick someone else.';
    }).bindTo($scope);
    $scope.attack = function(id){
      $scope.message = '';
      socket.emit('attack',{id:$scope.id,attack:id});
      $scope.idToBite = id;
    };
    $scope.sendAnswer = function(){
      var answer = {
        id:$scope.id,
        team:$scope.team,
        otherTeam:$scope.otherTeam,
        answer: $scope.answerInput,
        answerId: $scope.pData.id,
        hit: $scope.idToBite
      };
      socket.emit('submitAnswer',answer);
      $scope.answerInput = '';
    };
});