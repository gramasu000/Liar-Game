BasicGame.WaitingRoom = function (game) {
	
	this.waitingRoomBackground = null;

}

var text;
var numPlayersRemaining = 3;

socket.on('playerCount',function(data){
	numPlayersRemaining = data;
});

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
	}

};
