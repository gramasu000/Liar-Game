// Create a EJS object
var ejs = require('ejs');
// Create a Express JS server object
var express = require('express');
app = express();
// Create an HTTP object
http = require('http');

// List of all users
var allpseudos = [];

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
}

setInterval(sendTime,1000);

// Connection event
io.sockets.on('connection', function (socket) {
	console.log('a user connected');
	// SetPseudo event
	socket.on('setPseudo', function (data) {
    	socket.pseudo = data;
      	allpseudos.push(data);
      	socket.broadcast.emit('setPseudo', data);

	});

	// Obtaining a sent message event
	socket.on('message', function (message) {
    	var data = { 'message' : message[0], 'pseudo' : socket.pseudo, 'recipient' : message[1]};
    	socket.broadcast.emit('message', data);
    	console.log("user " + socket.pseudo + " sent to user " + message[1] + ": " + message[0]);
	});


	//Alerts when someone disconnects
	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});
