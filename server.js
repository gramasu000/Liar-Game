// Create a EJS object
var ejs = require('ejs');
// Create a Express JS server object
var express = require('express');
app = express();
// Create an HTTP object
http = require('http');



// List of all users
var allpseudos = [];
// Health Values
var health = {0: 100, 1:100, 2:100, 3:100 };
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
var timer = {'timer': 10};
function sendTime(){
	if (timer == 0)
		timer['timer'] = 150;
	io.sockets.emit('time', timer);
	if (timer['timer'] > 0)
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

	// Obtaining actions a player has taken
	socket.on('actions', function(data) {

		var i;
		for (i = 0; i < allpseudos.length; i++) {
			if (allpseudos[i] == socket.pseudo) {
				break; 
			}
		} 
		actions[i] = data;
		console.log('User ' + socket.pseudo  + "," + i + ' submitted actions. ' + Object.keys(actions).length);

		if (Object.keys(actions).length == 4)
		{

			for (var j = 0; j < allpseudos.length; j++)
			{
				var init_decrease = 0;
				for (var k = 0; k < 6; k++)
				{
					if (actions[j][k])
					{
						init_decrease++;
					}
				}
				health[j] = health[j] - init_decrease;

				console.log(init_decrease);

				if (health[j] < 0)
					health[j] = 0;
			}

			// Enumerate 12 possibilities

			// If #0 attacked #1 and #1 did not defend and #0 is still alive after init_decrease
			if (actions[0][0] && !actions[1][1] && (health[0] > 0))
			{
				console.log("0 attacks 1");
				health[1] = health[1] - 3;
			}
			// If #1 attacked #0 and #0 did not defend and #1 is still alive after init_decrease
			if (actions[1][0] && !actions[0][1] && (health[1] > 0))
			{
				console.log("1 attacks 0");
				health[0] = health[0] - 3;
			}
			// If #0 attacked #2 and #2 did not defend and #0 is still alive after init_decrease
			if (actions[0][2] && !actions[2][1] && (health[0] > 0))
			{
				console.log("0 attacks 2");
				health[2] = health[2] - 3;
			}
			// If #2 attacked #0 and #0 did not defend and #2 is still alive after init_decrease
			if (actions[2][0] && !actions[0][3] && (health[2] > 0))
			{
				console.log("2 attacks 0");
				health[0] = health[0] - 3;
			}
			//If #0 attacked #3 and #3 did not defend and #0 is still alive after init_decrease
			if (actions[0][4] && !actions[3][1] && (health[0] > 0))
			{
				console.log("0 attacks 3");
				health[3] = health[3] - 3;
			}
			// If #3 attacked #0 and #0 did not defend and #3 is still alive after init_decrease
			if (actions[3][0] && !actions[0][5] && (health[3] > 0))
			{
				console.log("3 attacks 0");
				health[0] = health[0] - 3;
			}
			// If #1 attacked #2 and #2 did not defend and #1 is still alive after init_decrease
			if (actions[1][2] && !actions[2][3] && (health[1] > 0))
			{
				console.log("1 attacks 2");
				health[2] = health[2] - 3;
			}
			// If #2 attacked #1 and #1 did not defend and #2 is still alive after init_decrease
			if (actions[2][2] && !actions[1][3] && (health[2] > 0))
			{
				console.log("2 attacks 1");
				health[1] = health[1] - 3;
			}
			// If #1 attacked #3 and #3 did not defend and #1 is still alive after init_decrease
			if (actions[1][4] && !actions[3][3] && (health[1] > 0))
			{
				console.log("1 attacks 3");
				health[3] = health[3] - 3;
			}
			// If #3 attacked #1 and #1 did not defend and #3 is still alive after init_decrease
			if (actions[3][2] && !actions[1][5] && (health[3] > 0))
			{
				console.log("3 attacks 1");
				health[1] = health[1] - 3;
			}
			// If #2 attacked #3 and #3 did not defend and #2 is still alive after init_decrease
			if (actions[2][4] && !actions[3][5] && (health[2] > 0))
			{
				console.log("2 attacks 3");
				health[3] = health[3] - 3;
			}
			// If #3 attacked #2 and #2 did not defend and #3 is still alive after init_decrease
			if (actions[3][4] && !actions[2][5] && (health[3] > 0))
			{
				console.log("3 attacks 2");
				health[2] = health[2] - 3;
			}

			var userhealth = {}

			for (var count = 0; count < allpseudos.length; count++)
			{
				userhealth[allpseudos[count]] = health[count];
			}

			socket.broadcast.emit('health', userhealth);
			socket.emit('health', userhealth);

		}

	}); 


	//Alerts when someone disconnects
	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});
