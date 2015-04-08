// Create a EJS object
var ejs = require('ejs');
// Create a Express JS server object
var express = require('express');
app = express();
// Create an HTTP object
http = require('http');

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

// Health Values
var health = {};
var actions = {};

// Set the parameters
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("view options", { layout: false });
app.use(express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);

app.get('/', function(req, res){
  res.render('home.html');
});

var server = http.createServer(app);

// Create a socket.io object
var io = require('socket.io').listen(server);
server.listen(3000);

//Send time to all players
var timer = 150;
function sendTime(){
	if (timer == 0)
		timer = 150;
	io.sockets.emit('time', timer);
	if (timer > 0)
		timer--;
}

//Send time every second
setInterval(sendTime,1000);

function startCountdown(time,room){
	var timeLeft = time;
	countdown = setInterval(function(){
		io.to(room).emit('countdownTimer',timeLeft);
		timeLeft--;
	},1000)
	if (timeLeft <= 0){
		clearInterval(countdown);
	}
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

// Connection event
io.sockets.on('connection', function (socket) {
	console.log('user ' + socket.id + ' connected');
	
	io.to(socket.id).emit('initializeRoomButtons',rooms);

	// SetPseudo event
	socket.on('setPseudo', function (data) {
    	socket.pseudo = data['pseudo'];
    	health[socket.id] = 100;
    	IDtoPseudo[socket.id] = socket.pseudo;
      	io.to(clients[socket.id]).emit('setPseudo', data);
	});

	// Obtaining a sent message event
	socket.on('message', function (message) {
    	var data = { 'message' : message[0], 'pseudo' : socket.pseudo, 'recipient' : message[1]};
    	io.to(clients[socket.id]).emit('message', data);
    	console.log("user " + socket.pseudo + " sent to user " + message[1] + ": " + message[0]);
	});

	//Hosting a room
	//NOTE: Need to implement error handling stuff
	socket.on('host', function(roomName){
		console.log(Object.keys(rooms));
		if (roomExists(roomName)){
			io.to(socket.id).emit('roomApproved',false);
			console.log("Room with same name already exists!");
		}
		else if (Object.keys(rooms).length < 8) {
			socket.join(roomName);
			rooms[roomName] = 1;
			clients[socket.id] = roomName;
			clientPlayers[socket.id] = 0;
			socketIDs[roomName] = [];
			socketIDs[roomName][0] = socket.id;
			console.log("user " + socket.id + " has hosted room " + roomName);
			socket.broadcast.emit('createRoomButton',roomName);
			io.to(socket.id).emit('roomApproved',true);
		}
		else{
			io.to(socket.id).emit('roomApproved',false);
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
			socket.broadcast.emit('updateRoomButtons',roomName);
			console.log("user " + socket.id + " has joined room " + roomName);
			io.to(socket.id).emit('roomApproved',true);
			if (rooms[roomName] == 4){
				startCountdown(10,roomName);
			}
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

	// Obtaining actions a player has taken
	socket.on('actions', function(data) {
		var id = data['id'];
		var roomName = clients[id];
		var i = clientPlayers[socket.id];
		if (actions[roomName] == null){
			actions[roomName] = [];
		}
		actions[roomName][i] = data;
		console.log(actions[roomName][i]);
		console.log('User ' + socket.pseudo  + "," + i + ' submitted actions. ' + (actions[roomName].length-1));

		if (actions[roomName].length == 4)
		{
			for (var j = 0; j < rooms[roomName]; j++)
			{
				var init_decrease = 0;
				for (var k = 0; k < 6; k++)
				{
					if (actions[roomName][j][k])
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
			if (actions[roomName][0][0] && !actions[roomName][1][1] && (health[socketIDs[roomName][0]] > 0))
			{
				console.log("0 attacks 1");
				health[socketIDs[roomName][1]] -= 3;
			}
			// If #1 attacked #0 and #0 did not defend and #1 is still alive after init_decrease
			if (actions[roomName][1][0] && !actions[roomName][0][1] && (health[socketIDs[roomName][1]] > 0))
			{
				console.log("1 attacks 0");
				health[socketIDs[roomName]] -= 3;
			}
			// If #0 attacked #2 and #2 did not defend and #0 is still alive after init_decrease
			if (actions[roomName][0][2] && !actions[roomName][2][1] && (health[socketIDs[roomName][0]] > 0))
			{
				console.log("0 attacks 2");
				health[socketIDs[roomName]] -= 3;
			}
			// If #2 attacked #0 and #0 did not defend and #2 is still alive after init_decrease
			if (actions[roomName][2][0] && !actions[roomName][0][3] && (health[socketIDs[roomName][2]] > 0))
			{
				console.log("2 attacks 0");
				health[socketIDs[roomName][0]] -= 3;
			}
			//If #0 attacked #3 and #3 did not defend and #0 is still alive after init_decrease
			if (actions[roomName][0][4] && !actions[roomName][3][1] && (health[socketIDs[roomName][0]] > 0))
			{
				console.log("0 attacks 3");
				health[socketIDs[roomName][3]] -= 3;
			}
			// If #3 attacked #0 and #0 did not defend and #3 is still alive after init_decrease
			if (actions[roomName][3][0] && !actions[roomName][0][5] && (health[socketIDs[roomName][3]] > 0))
			{
				console.log("3 attacks 0");
				health[socketIDs[roomName][0]] -= 3;
			}
			// If #1 attacked #2 and #2 did not defend and #1 is still alive after init_decrease
			if (actions[roomName][1][2] && !actions[roomName][2][3] && (health[socketIDs[roomName][1]] > 0))
			{
				console.log("1 attacks 2");
				health[socketIDs[roomName][2]] -=  3;
			}
			// If #2 attacked #1 and #1 did not defend and #2 is still alive after init_decrease
			if (actions[roomName][2][2] && !actions[roomName][1][3] && (health[socketIDs[roomName][2]] > 0))
			{
				console.log("2 attacks 1");
				health[socketIDs[roomName][1]] -=  3;
			}
			// If #1 attacked #3 and #3 did not defend and #1 is still alive after init_decrease
			if (actions[roomName][1][4] && !actions[roomName][3][3] && (health[socketIDs[roomName][1]] > 0))
			{
				console.log("1 attacks 3");
				health[socketIDs[roomName][3]] -=  3;
			}
			// If #3 attacked #1 and #1 did not defend and #3 is still alive after init_decrease
			if (actions[roomName][3][2] && !actions[roomName][1][5] && (health[socketIDs[roomName][3]] > 0))
			{
				console.log("3 attacks 1");
				health[socketIDs[roomName][1]] -=  3;
			}
			// If #2 attacked #3 and #3 did not defend and #2 is still alive after init_decrease
			if (actions[roomName][2][4] && !actions[roomName][3][5] && (health[socketIDs[roomName][2]] > 0))
			{
				console.log("2 attacks 3");
				health[socketIDs[roomName][3]] -=  3;
			}
			// If #3 attacked #2 and #2 did not defend and #3 is still alive after init_decrease
			if (actions[roomName][3][4] && !actions[roomName][2][5] && (health[socketIDs[roomName][3]] > 0))
			{
				console.log("3 attacks 2");
				health[socketIDs[roomName][2]] -=  3;
			}

			var userhealth = {};

			for (var count = 0; count < rooms[roomName]; count++)
			{
				userhealth[IDtoPseudo[socketIDs[roomName][count]]] = health[socketIDs[roomName][count]];
			}

			socket.to(rooms[data[id]]).emit('health', userhealth);

		}

	}); 

	//Alerts when someone disconnects
	socket.on('disconnect', function(){
		console.log('user ' + socket.id + ' disconnected');
		rooms[clients[socket.id]]--;
		if (rooms[clients[socket.id]] <= 0){
			delete rooms[clients[socket.id]];
		}
		delete clients[socket.id];
		delete clientPlayers[socket.id];
	});
});
