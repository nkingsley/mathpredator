angular.module('mathPredator', ['socket-io'])
.controller('mainControl', function($scope, $http, socket) {
  $scope.color = ['blue','red'];
  $scope.safetyColors = {false:'yellow',true:'black'};
  $scope.zombies = {
    1: "M96.5,150 C96.5,150 105.5,125 105.5,125 C105.5,125 96.5,109 96.5,109 C96.5,109 82.5,125 82.5,125 C82.5,125 66.5,92 66.5,92 C66.5,92 52.5,104 52.5,104 C52.5,104 66.5,132 66.5,132 C66.5,132 41.5,144 41.5,144 C41.5,144 41.5,160 41.5,160 C41.5,160 66.5,150 66.5,150 C66.5,150 52.5,175 52.5,175 C52.5,175 66.5,180 66.5,180 C66.5,180 82.5,160 82.5,160 C82.5,160 155.5,227 155.5,227 C155.5,227 213.5,184 213.5,184 C213.5,184 226.5,305 226.5,305 C226.5,305 169.5,376 169.5,376 C169.5,376 177.5,453 177.5,453 C177.5,453 133.5,462 133.5,462 C133.5,462 143.5,474 143.5,474 C143.5,474 223.5,475 223.5,475 C223.5,475 211.5,391 211.5,391 C211.5,391 266.5,323 266.5,323 C266.5,323 298.5,384 298.5,384 C298.5,384 334.5,450 334.5,450 C334.5,450 393.5,432 393.5,432 C393.5,432 400.5,417 400.5,417 C400.5,417 360.5,426 360.5,426 C360.5,426 337.5,354 337.5,354 C337.5,354 292.5,290 292.5,290 C292.5,290 293.5,180 293.5,180 C293.5,180 397.5,218 397.5,218 C397.5,218 377.5,125 377.5,125 C377.5,125 409.5,144 409.5,144 C409.5,144 418.5,132 418.5,132 C418.5,132 388.5,117 388.5,117 C388.5,117 423.5,120 423.5,120 C423.5,120 435.5,96 435.5,96 C435.5,96 397.5,100 397.5,100 C397.5,100 429.5,77 429.5,77 C429.5,77 409.5,63 409.5,63 C409.5,63 377.5,84 377.5,84 C377.5,84 364.5,51 364.5,51 C364.5,51 328.5,66 328.5,66 C328.5,66 354.5,92 354.5,92 C354.5,92 369.5,187 369.5,187 C369.5,187 285.5,140 285.5,140 C285.5,140 266.5,125 266.5,125 C266.5,125 246.5,129 246.5,129 C246.5,129 250.5,107 250.5,107 C250.5,107 272.5,77 272.5,77 C272.5,77 276.5,44 276.5,44 C276.5,44 246.5,22 246.5,22 C246.5,22 204.5,25 204.5,25 C204.5,25 178.5,57 178.5,57 C178.5,57 188.5,96 188.5,96 C188.5,96 216.5,107 216.5,107 C216.5,107 216.5,128 216.5,128 C216.5,128 194.5,132 194.5,132 C194.5,132 186.5,156 186.5,156 C186.5,156 156.5,191 156.5,191 C156.5,191 96.5,150 96.5,150 Z",
    2: "M239.5,404.5 C239.5,404.5 196.5,417.5 196.5,417.5 C196.5,417.5 206.5,438.5 206.5,438.5 C206.5,438.5 254.5,438.5 254.5,438.5 C254.5,438.5 300.5,303.5 300.5,303.5 C300.5,303.5 363.5,335.5 363.5,335.5 C363.5,335.5 393.5,293.5 393.5,293.5 C393.5,293.5 320.5,246.5 320.5,246.5 C320.5,246.5 318.5,173.5 318.5,173.5 C318.5,173.5 444.5,227.5 444.5,227.5 C444.5,227.5 445.5,259.5 445.5,259.5 C445.5,259.5 454.5,235.5 454.5,235.5 C454.5,235.5 471.5,250.5 471.5,250.5 C471.5,250.5 466.5,226.5 466.5,226.5 C466.5,226.5 485.5,225.5 485.5,225.5 C485.5,225.5 460.5,210.5 460.5,210.5 C460.5,210.5 466.5,193.5 466.5,193.5 C466.5,193.5 444.5,207.5 444.5,207.5 C444.5,207.5 300.5,133.5 300.5,133.5 C300.5,133.5 272.5,141.5 272.5,141.5 C272.5,141.5 272.5,120.5 272.5,120.5 C272.5,120.5 295.5,100.5 295.5,100.5 C295.5,100.5 299.5,58.5 299.5,58.5 C299.5,58.5 268.5,30.5 268.5,30.5 C268.5,30.5 254.5,34.5 254.5,34.5 C254.5,34.5 239.5,69.5 239.5,69.5 C239.5,69.5 254.5,46.5 254.5,46.5 C254.5,46.5 263.5,76.5 263.5,76.5 C263.5,76.5 263.5,103.5 263.5,103.5 C263.5,103.5 245.5,118.5 245.5,118.5 C245.5,118.5 246.5,146.5 246.5,146.5 C246.5,146.5 219.5,154.5 219.5,154.5 C219.5,154.5 142.5,169.5 142.5,169.5 C142.5,169.5 143.5,138.5 143.5,138.5 C143.5,138.5 122.5,163.5 122.5,163.5 C122.5,163.5 106.5,128.5 106.5,128.5 C106.5,128.5 102.5,169.5 102.5,169.5 C102.5,169.5 75.5,164.5 75.5,164.5 C75.5,164.5 102.5,187.5 102.5,187.5 C102.5,187.5 102.5,210.5 102.5,210.5 C102.5,210.5 123.5,193.5 123.5,193.5 C123.5,193.5 222.5,191.5 222.5,191.5 C222.5,191.5 239.5,262.5 239.5,262.5 C239.5,262.5 239.5,404.5 239.5,404.5 Z",
    3: "M157.849,406.062 C157.849,406.062 216.849,406.062 216.849,406.062 C216.849,406.062 181.849,384.062 181.849,384.062 C181.849,384.062 248.849,339.062 248.849,339.062 C248.849,339.062 207.849,272.062 207.849,272.062 C207.849,272.062 300.849,335.062 300.849,335.062 C300.849,335.062 250.849,403.062 250.849,403.062 C250.849,403.062 334.849,400.062 334.849,400.062 C334.849,400.062 302.849,379.062 302.849,379.062 C302.849,379.062 331.849,330.062 331.849,330.062 C331.849,330.062 247.849,239.062 247.849,239.062 C247.849,239.062 318.849,206.062 318.849,206.062 C318.849,206.062 383.849,249.062 383.849,249.062 C383.849,249.062 380.849,310.062 380.849,310.062 C380.849,310.062 376.849,326.062 376.849,326.062 C376.849,326.062 400.849,326.062 400.849,326.062 C400.849,326.062 398.849,310.062 398.849,310.062 C398.849,310.062 401.849,248.062 401.849,248.062 C401.849,248.062 343.849,183.062 343.849,183.062 C343.849,183.062 393.849,176.062 393.849,176.062 C393.849,176.062 407.849,152.062 407.849,152.062 C407.849,152.062 394.849,115.062 394.849,115.062 C394.849,115.062 360.849,100.062 360.849,100.062 C360.849,100.062 330.849,126.062 330.849,126.062 C330.849,126.062 335.849,157.062 335.849,157.062 C335.849,157.062 304.849,149.062 304.849,149.062 C304.849,149.062 269.849,138.062 269.849,138.062 C269.849,138.062 261.849,159.062 261.849,159.062 C261.849,159.062 163.849,243.062 163.849,243.062 C163.849,243.062 168.849,294.062 168.849,294.062 C168.849,294.062 210.849,336.062 210.849,336.062 C210.849,336.062 151.849,383.062 151.849,383.062 C151.849,383.062 157.849,406.062 157.849,406.062 Z"
  }
  // On connect, server sends player and team data.
  setInterval(function(){
    $scope.playerArray = [];
    for (var id in $scope.players){
      $scope.playerArray.push([$scope.randInt(1500),$scope.randInt(1500)]);
    }
    d3.select('svg').selectAll('ellipse')
    .data($scope.playerArray)
    .transition().duration(2000)
    .attr('cx',function(d){return d[0] + 250})
    .attr('cy',function(d){return d[1] + 200});
    d3.select('svg').selectAll('path')
    .data($scope.playerArray)
    .transition().duration(2000)
    .attr('transform',function(d){return 'translate(' + d[0] + ',' + d[1] + ')'})
    d3.select('svg').selectAll('text')
    .data($scope.playerArray)
    .transition().duration(2000)
    .attr('transform',function(d){return 'translate(' + d[0] + ',' + d[1] + ')'})
    $scope.$apply();
  },2000);
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
    $scope.teams[$scope.players[data.bitten].team].score--;
    if ($scope.id !== data.biter){
      $scope.teams[$scope.players[data.biter].team].score++;
    }
  }).bindTo($scope);
  socket.on('youwerebitten', function(data){
    $scope.bitten = true;
    $scope.message = 'you were bitten by ' + $scope.players[data].name + '.  Get revenge soon!';
  }).bindTo($scope);
  socket.on('newRound', function(data){
    $scope.bitten = false;
    $scope.message = '';
    $scope.problem = 'New Round!';
    $scope.teams = [data[0],data[1]];
    $scope.players = data[2];
  }).bindTo($scope);
  socket.on('wrong', function(data){
    $scope.message = 'wrong';
    $scope.teams[$scope.team].score--;
  }).bindTo($scope);
  socket.on('newName', function(data){
    $scope.players[data.id] = data;
  })
  socket.on('attackedSafePlayer', function(data){
    $scope.answerInput = data;
    $scope.message = 'rats... they\'re safe.  Pick someone else.';
  }).bindTo($scope);
  $scope.attack = function(id){
    $scope.message = '';
    socket.emit('attack',{id:$scope.id,attack:id});
    $scope.idToBite = id;
  };
  $scope.sendUserName = function(){
    socket.emit('username',{name:$scope.username,id:$scope.id});
  }
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
    $scope.teams[$scope.team].score++;
  };
  $scope.randInt = function(max){
    return Math.ceil(Math.random()*max);
  };
});