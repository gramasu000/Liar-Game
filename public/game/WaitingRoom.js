BasicGame.WaitingRoom = function (game) {
	
	this.waitingRoomBackground = null;

}

var text;
var numPlayersRemaining = 3;
var timer = 10;

socket.on('playerCount',function(data){
	numPlayersRemaining = data;
	if (numPlayersRemaining <= 0){
		socket.emit('startTimer',timer);
	}
});

socket.on('countdownTimer',function(data){
	timer = data;
	if (timer <= 0){
		game.state.start('SetPseudo');
	}
})

BasicGame.WaitingRoom.prototype = {

	preload: function () {
		this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.waitingRoomBackground.width = 800;
        this.waitingRoomBackground.height = 600;
	},

	create: function () {

		var style = { font: "60px Arial", fill: "#ff0044", align: "center" };

    	text = game.add.text(game.world.centerX, game.world.centerY, 
    		"Waiting for " + numPlayersRemaining + " more players", style);

    	text.anchor.set(0.5);

	},

	update: function () {
		text.setText("Waiting for " + numPlayersRemaining + " more players");
		if (numPlayersRemaining <= 0){
			text.setText("Game Starting in " + timer);
		}
	}

};
