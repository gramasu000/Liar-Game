#!/bin/env node
// Create a EJS object
var ejs = require('ejs');
// Create a Express JS server object
var express = require('express');
app = express();
// Create an HTTP object
http = require('http');

var server = http.createServer(app);

// Create a socket.io object
var io = require('socket.io').listen(server);

//List of all room names that keep track of number of players
var rooms = {};

//Map of clients - this tells us which players are in which room
var clients = {};

//Position of user in each room client
var clientPlayers = {};

//Given room and index, provides socket id
var socketIDs = {};

//Map from socket IDs to pseudo names
var IDtoPseudo = {};

//Map from socket IDs to state in the game
var socketStates = {};

// Who among all players set pseudo
var who_set_pseudo = {};

// Who among all players set actions
var who_set_actions = {};

// Health Values
var health = {};
var actions = {};

// Is the game phase running?
var gamecount = {};

//Is the pseudo name phase running?
var pseudocount = {};

// If everyone submits before timer runs out
var presubmit = {};

// If game is running
var gamerunning = {};

// Constant Values - MUST MATCH THE SAME NAME ON SCRIPT FILE
var GAME_TIME = 150;
var RESULTS_TIME = 15;
var MAX_HEALTH = 20;
var PSEUDO_TIME = 30;

// Set the parameters
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("view options", { layout: false });
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);  
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.use(express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);

app.get('/', function(req, res){
  res.render('home.html');
});

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});

function GameCountDown(time, room) {
	var timeLeft = time;
	
	var countdown = setInterval(function(){
		io.to(room).emit('Gamecountdown', timeLeft);
		timeLeft--;
		if ((timeLeft < 0) || (presubmit[room])){
			clearInterval(countdown);
			ResultsCountDown(RESULTS_TIME, room);
			gamecount[room] = false;
			presubmit[room] = false;
		}
	},1000)

}

function ResultsCountDown(time, room) {
	var timeLeft = time;
	var countdown = setInterval(function(){
		io.to(room).emit('Resultscountdown', timeLeft);
		timeLeft--;
		if (timeLeft < 0){
			clearInterval(countdown);
			if (gamerunning[room])
			{
				GameCountDown(GAME_TIME, room);
			}
			gamecount[room] = true;
			presubmit[room] = false;
		}
	},1000)

}

function startCountdown(time,room){
	var timeLeft = time;
	var countdown = setInterval(function(){
		io.to(room).emit('countdownTimer',timeLeft);
		timeLeft--;
		if (timeLeft < 0){
			clearInterval(countdown);
			console.log("Game in room " + room + " has started!");
			for (var i = 0; i < 4; ++i){
				var temp = socketIDs[room][i];
				socketStates[temp] = "Game";
			}
		}
	},1000)
}

function startPseudoCountdown(time,room){
	var timeLeft = time;
	var countdown = setInterval(function(){
		io.to(room).emit('pseudoTimer',timeLeft);
		timeLeft--;
		console.log("Time decremented");
		if (timeLeft < 0){
			clearInterval(countdown);
			console.log("WaitingRoom2 started in room " + room);
		}
	},1000)
}

//Helper function to see if room exists
function roomExists(room) {
	for (var i = Object.keys(rooms).length - 1; i >= 0; i--) {
		if (Object.keys(rooms)[i] == room){
			return true;
		}
	}
	return false;
};

function handleDisconnect(socket,state){
	if (state == "MainMenu"){
		console.log("user " + socket.id + " has disconnected from main menu");
	}
	else if (state == "HostRoom"){
		console.log("user " + socket.id + " has disconnected from host room");	
	}
	else if (state == "JoinRoom"){
		console.log("user " + socket.id + " has disconnected from join room");	
	}
	else if (state == "WaitingRoom"){
		console.log("user " + socket.id + " has exited room " + roomName);
		socket.leave(roomName);
		socket.broadcast.emit('updateRoomButtons',{'increase' : false, 'name' : roomName});
		rooms[roomName]--;
		var data = 4 - rooms[roomName];
		io.to(roomName).emit('playerCount',data);
		if (rooms[roomName] <= 0){
			socket.broadcast.emit('deleteRoomButton',roomName);
			delete rooms[roomName];
			delete socketIDs[roomName];
			delete clients[roomName];
			delete clientPlayers[socket.id];
			delete socketStates[socket.id];
		}
		else{
			var index = clientPlayers[socket.id];
			delete clientPlayers[socket.id];
			socketIDs[roomName][index] = null;
			var allPlayers = Object.keys(clients);
			var remainingPlayers = [];
			for (var i = 0; i < allPlayers.length; i++) {
				var user = allPlayers[i];
				var clientToCheck = clients[user];
				if (clientToCheck == roomName){
					remainingPlayers[clientPlayers[user]] = user;
				}
			}
			var tempIndex = 0;
			for (var i = 0; i < remainingPlayers.length; i++) {
				if (remainingPlayers[i] != null){
					clientPlayers[remainingPlayers[i]] = tempIndex++;
				}
			}

		}
	}
	else if (state == "WaitingRoom2" && state == "SetPseudo"){
		console.log("user " + socket.id + " has exited room " + roomName);
		socket.leave(roomName);
		io.to(roomName).emit('kickedOut')
		rooms[roomName]--;
		var data = 4 - rooms[roomName];
		io.to(roomName).emit('playerCount',data);
		socket.broadcast.emit('deleteRoomButton',roomName);
		delete rooms[roomName];
		delete socketIDs[roomName];
		delete clients[roomName];
		delete clientPlayers[socket.id];
		delete socketStates[socket.id];
		delete health[socket.id];
    	delete IDtoPseudo[socket.id];
    	delete who_set_pseudo[clients[socket.id]][clientPlayers[socket.id]];
	}


};

// Connection event
io.sockets.on('connection', function (socket) {
	console.log('user ' + socket.id + ' connected');
	
	//Initialize room buttons every time someone requests to join game
	socket.on('initializeRooms', function(){
		io.to(socket.id).emit('initializeRoomButtons',rooms);
		socketStates[socket.id] = "JoinRoom";
	});

	// SetPseudo event
	socket.on('setPseudo', function (data) {
    	socket.pseudo = data['pseudo'];
    	health[socket.id] = MAX_HEALTH;
    	IDtoPseudo[socket.id] = socket.pseudo;
    	who_set_pseudo[clients[socket.id]][clientPlayers[socket.id]] = true;
    	socketStates[socket.id] = "WaitingRoom2";
	});

	// Obtaining a sent message event
	socket.on('message', function (message) {
    	var data = { 'message' : message[0], 'pseudo' : socket.pseudo, 'recipient' : message[1]};
    	io.to(clients[socket.id]).emit('message', data);
    	//console.log("user " + socket.pseudo + " sent to user " + message[1] + ": " + message[0]);
	});

	//Hosting a room
	//NOTE: Need to implement error handling stuff
	socket.on('host', function(roomName){
		if (roomExists(roomName)){
			io.to(socket.id).emit('roomApproved',{'approved' : false, 'name' : roomName});
			console.log("Room with same name already exists!");
		}
		else if (Object.keys(rooms).length < 10) {
			//Initialize non-boolean maps
			rooms[roomName] = 1;
			clients[socket.id] = roomName;
			clientPlayers[socket.id] = 0;
			socketIDs[roomName] = [];
			socketIDs[roomName][0] = socket.id;

			//Initialize boolean maps
			who_set_pseudo[roomName] = [false, false, false, false];
			who_set_actions[roomName] = [false, false, false, false];
			pseudocount[roomName] = false;
			gamecount[roomName] = false;
			presubmit[roomName] = false;

			console.log("user " + socket.id + " has hosted room " + roomName);
			socket.broadcast.emit('createRoomButton',roomName);
			io.to(socket.id).emit('roomApproved',{'approved' : true, 'name' : roomName, 'position' : clientPlayers[socket.id]});
			io.to(socket.id).emit('playerCount',3);
			socket.join(roomName);
			socketStates[socket.id] = "WaitingRoom";
		}
		else{
			io.to(socket.id).emit('roomApproved',{'approved' : false, 'name' : roomName});
			console.log("Too many rooms currently active");
		}
	});

	//Joining a room
	//NOTE: Need to implement error handling stuff
	socket.on('join', function(roomName){
		if (roomExists(roomName) && rooms[roomName] < 4){
			if (rooms[roomName] == 4){
				console.log("Game is full");
			}
			socket.join(roomName);
			clients[socket.id] = roomName;
			clientPlayers[socket.id] = rooms[roomName]++;
			socketIDs[roomName][clientPlayers[socket.id]] = socket.id;
			var data = 4 - rooms[roomName];
			io.to(roomName).emit('playerCount',data);
			socket.broadcast.emit('updateRoomButtons',{'name' : roomName, 'increase' : true});
			console.log("user " + socket.id + " has joined room " + roomName);
			io.to(socket.id).emit('roomApproved',{'approved' : true, 'name' : roomName, 'position' : clientPlayers[socket.id]});
			socketStates[socket.id] = "WaitingRoom";

		}
		else if (rooms[roomName] >= 4){
			console.log("Room " + roomName + " is full");
			io.to(socket.id).emit('roomApproved',false);
		}
		else{
			console.log("Room " + roomName + " does not exist");
			io.to(socket.id).emit('roomApproved',false);
		}
	});

	socket.on('exitRoom',function(roomName){
		
		handleDisconnect(socket,"ExitRoom");

	});

	socket.on('startTimer', function(timer) {

		if (who_set_pseudo[clients[socket.id]][0] && 
			who_set_pseudo[clients[socket.id]][1] && 
			who_set_pseudo[clients[socket.id]][2] && 
			who_set_pseudo[clients[socket.id]][3])
		{
			var roomName = clients[socket.id];
			for (var i = 0; i < 4; i++)
			{
				io.to(roomName).emit('setPseudo', IDtoPseudo[socketIDs[roomName][i]]);
			}
			startCountdown(10, clients[socket.id]);
		}
	});

	socket.on('startGameTimer', function (num) {
		var roomName = clients[socket.id];
		if (!gamecount[roomName])
		{
			gamecount[roomName] = true;
			gamerunning[roomName] = true;
			GameCountDown(num, roomName);
		}
	});

	socket.on('startPseudoTimer',function (num){
		var roomName = clients[socket.id];
		if (!pseudocount[roomName]){
			console.log("Hi");
			pseudocount[roomName] = true;

			startPseudoCountdown(num,roomName);
		}
	});

	// Obtaining actions a player has taken
	socket.on('actions', function(data) {
		var id = data['id'];
		var roomName = clients[id];
		var i = clientPlayers[socket.id];
		if (actions[roomName] == null){
			actions[roomName] = [];
		}
		actions[roomName][i] = data;
		who_set_actions[roomName][i] = true;

		console.log('User ' + socket.pseudo  + "," + i + ' submitted actions. ' + (actions[roomName].length-1));

		if ((who_set_actions[roomName][0] || health[socketIDs[roomName][0]] <= 0) 
			&& (who_set_actions[roomName][1] || health[socketIDs[roomName][1]] <= 0)
			&& (who_set_actions[roomName][2] || health[socketIDs[roomName][2]] <= 0) 
			&& (who_set_actions[roomName][3] || health[socketIDs[roomName][3]] <= 0))
		{
			for (var i = 0; i < 4; ++i){
				if (!who_set_actions[roomName][i]){
					console.log("Player " + i + " has below 0 health");
					actions[roomName][i] = {0: false, 
									 		1: false, 
                        			 		2: false, 
                        			 		3: false, 
                        			 		4: false,
                        			 		5: false};
				}
			}

			presubmit[roomName] = true;
			for (var j = 0; j < rooms[roomName]; j++)
			{
				var init_decrease = 0;
				for (var k = 0; k < 6; k++)
				{
					if (health[socketIDs[roomName][j]] > 0 && actions[roomName][j][k])
					{
						init_decrease++;
					}
				}
				health[socketIDs[roomName][j]] -= init_decrease;

				console.log(init_decrease);

				if (health[socketIDs[roomName][j]] < 0)
					health[socketIDs[roomName][j]] = 0;
			}

			// Enumerate 12 possibilities

			// If #0 attacked #1 and #1 did not defend and #0 is still alive after init_decrease
			if ((health[socketIDs[roomName][0]] > 0) && actions[roomName][0][0] && !actions[roomName][1][1])
			{
				console.log("0 attacks 1");
				health[socketIDs[roomName][1]] -= 3;
			}
			// If #1 attacked #0 and #0 did not defend and #1 is still alive after init_decrease
			if ((health[socketIDs[roomName][1]] > 0) && actions[roomName][1][0] && !actions[roomName][0][1])
			{
				console.log("1 attacks 0");
				health[socketIDs[roomName][0]] -= 3;
			}
			// If #0 attacked #2 and #2 did not defend and #0 is still alive after init_decrease
			if ((health[socketIDs[roomName][0]] > 0) && actions[roomName][0][2] && !actions[roomName][2][1])
			{
				console.log("0 attacks 2");
				health[socketIDs[roomName][2]] -= 3;
			}
			// If #2 attacked #0 and #0 did not defend and #2 is still alive after init_decrease
			if ((health[socketIDs[roomName][2]] > 0) && actions[roomName][2][0] && !actions[roomName][0][3])
			{
				console.log("2 attacks 0");
				health[socketIDs[roomName][0]] -= 3;
			}
			//If #0 attacked #3 and #3 did not defend and #0 is still alive after init_decrease
			if ((health[socketIDs[roomName][0]] > 0) && actions[roomName][0][4] && !actions[roomName][3][1])
			{
				console.log("0 attacks 3");
				health[socketIDs[roomName][3]] -= 3;
			}
			// If #3 attacked #0 and #0 did not defend and #3 is still alive after init_decrease
			if ((health[socketIDs[roomName][3]] > 0) && actions[roomName][3][0] && !actions[roomName][0][5])
			{
				console.log("3 attacks 0");
				health[socketIDs[roomName][0]] -= 3;
			}
			// If #1 attacked #2 and #2 did not defend and #1 is still alive after init_decrease
			if ((health[socketIDs[roomName][1]] > 0) && actions[roomName][1][2] && !actions[roomName][2][3])
			{
				console.log("1 attacks 2");
				health[socketIDs[roomName][2]] -=  3;
			}
			// If #2 attacked #1 and #1 did not defend and #2 is still alive after init_decrease
			if ((health[socketIDs[roomName][2]] > 0) && actions[roomName][2][2] && !actions[roomName][1][3])
			{
				console.log("2 attacks 1");
				health[socketIDs[roomName][1]] -=  3;
			}
			// If #1 attacked #3 and #3 did not defend and #1 is still alive after init_decrease
			if ((health[socketIDs[roomName][1]] > 0) && actions[roomName][1][4] && !actions[roomName][3][3])
			{
				console.log("1 attacks 3");
				health[socketIDs[roomName][3]] -=  3;
			}
			// If #3 attacked #1 and #1 did not defend and #3 is still alive after init_decrease
			if ((health[socketIDs[roomName][3]] > 0) && actions[roomName][3][2] && !actions[roomName][1][5])
			{
				console.log("3 attacks 1");
				health[socketIDs[roomName][1]] -=  3;
			}
			// If #2 attacked #3 and #3 did not defend and #2 is still alive after init_decrease
			if ((health[socketIDs[roomName][2]] > 0) && actions[roomName][2][4] && !actions[roomName][3][5])
			{
				console.log("2 attacks 3");
				health[socketIDs[roomName][3]] -=  3;
			}
			// If #3 attacked #2 and #2 did not defend and #3 is still alive after init_decrease
			if ((health[socketIDs[roomName][3]] > 0) && actions[roomName][3][4] && !actions[roomName][2][5])
			{
				console.log("3 attacks 2");
				health[socketIDs[roomName][2]] -=  3;
			}

			//console.log("Sending Health and Actions");

			var userhealth_0 = {"self": health[socketIDs[roomName][0]], 0: health[socketIDs[roomName][1]], 
								1: health[socketIDs[roomName][2]], 2: health[socketIDs[roomName][3]] };
			var userhealth_1 = {"self": health[socketIDs[roomName][1]], 0: health[socketIDs[roomName][0]], 
								1: health[socketIDs[roomName][2]], 2: health[socketIDs[roomName][3]] };
			var userhealth_2 = {"self": health[socketIDs[roomName][2]], 0: health[socketIDs[roomName][0]], 
								1: health[socketIDs[roomName][1]], 2: health[socketIDs[roomName][3]] };
			var userhealth_3 = {"self": health[socketIDs[roomName][3]], 0: health[socketIDs[roomName][0]], 
								1: health[socketIDs[roomName][1]], 2: health[socketIDs[roomName][2]] };

			var actions_0 = {0: actions[roomName][1], 1: actions[roomName][2], 2: actions[roomName][3], "position": 0};
			var actions_1 = {0: actions[roomName][0], 1: actions[roomName][2], 2: actions[roomName][3], "position": 1};
			var actions_2 = {0: actions[roomName][0], 1: actions[roomName][1], 2: actions[roomName][3], "position": 2};
			var actions_3 = {0: actions[roomName][0], 1: actions[roomName][1], 2: actions[roomName][2], "position": 3};

			io.to(socketIDs[roomName][0]).emit('record-actions',actions_0);
			io.to(socketIDs[roomName][1]).emit('record-actions',actions_1);
			io.to(socketIDs[roomName][2]).emit('record-actions',actions_2);
			io.to(socketIDs[roomName][3]).emit('record-actions',actions_3);

			io.to(socketIDs[roomName][0]).emit('health',userhealth_0);
			io.to(socketIDs[roomName][1]).emit('health',userhealth_1);
			io.to(socketIDs[roomName][2]).emit('health',userhealth_2);
			io.to(socketIDs[roomName][3]).emit('health',userhealth_3);

			actions[roomName] = [];
			who_set_actions[roomName] = [false, false, false, false];	


		}

	});

	socket.on('gameEnd', function (data) {
		gamerunning[clients[socket.id]] = data;
		io.to(clients[socket.id]).emit('gameOver');
	}); 

	//Alerts when someone disconnects
	socket.on('disconnect', function(){
		handleDisconnect(socket,socketStates[socket.id]);
	});
});
