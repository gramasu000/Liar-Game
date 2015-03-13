// Create a Jade object
var jade = require('jade');
// Create a Express JS server object
var express = require('express');
app = express();
// Create an HTTP object
http = require('http');

// List of all users
var allpseudos = [];

// Set the parameters
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.use(express.static(__dirname + '/public'));

// Configure function
//app.configure(function() {
//    app.use(express.static(__dirname + '/public'));
//});

app.get('/', function(req, res){
  res.render('home.jade');
});


var server = http.createServer(app);
/*
app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})*/

// Create a socket.io object
var io = require('socket.io').listen(server);
server.listen(3000);

// Connection event
io.sockets.on('connection', function (socket) { 

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
    	console.log("user " + socket.pseudo + " send this : " + message);

	});
});
