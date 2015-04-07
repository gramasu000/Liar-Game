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
var timer = {'timer': 150};
function sendTime(){
	if (timer == 0)
		timer['timer'] = 150;
	io.sockets.emit('time', timer);
	timer['timer']--;
};

//Send time every second
setInterval(sendTime,1000);

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
	// SetPseudo event
	socket.on('setPseudo', function (data) {
    	socket.pseudo = data['pseudo'];
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
		socket.join(roomName);
		rooms[roomName] = 1;
		clients[socket.id] = roomName;
		clientPlayers[socket.id] = 0;
		console.log("user " + socket.id + " has hosted room " + roomName);
	});

	//Joining a room
	//NOTE: Need to implement error handling stuff
	socket.on('join', function(roomName){
		if (roomExists(roomName)){
			if (rooms[roomName] == 4){
				console.log("Game is full");
			}
			socket.join(roomName);
			clients[socket.id] = roomName;
			clientPlayers[socket.id] = rooms[roomName]++;
			var data = {'id' : socket.id};
			//io.to(roomName).emit('joined',data);
			console.log("user " + socket.id + " has joined room " + roomName);
			if (rooms[roomName] == 4){
				io.to(roomName).emit('gameStart',roomName);
			}
		}
		else{
			console.log("Room " + roomName + " does not exist");
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
