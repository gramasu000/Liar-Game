BasicGame.WaitingRoom2 = function (game) {
	
	this.waitingRoomBackground = null;

}

var text;
var timer = 10;

socket.on('countdownTimer',function(data){
	timer = data;
	if (timer == 0){
		game.state.start('Game');
	}
})

BasicGame.WaitingRoom2.prototype = {

	preload: function () {
		this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.waitingRoomBackground.width = 800;
        this.waitingRoomBackground.height = 600;
	},

	create: function () {

		var style = { font: "60px Arial", fill: "#ff0044", align: "center" };

    	text = game.add.text(game.world.centerX, game.world.centerY, "Game Starting in " + timer , style);

    	socket.emit('startTimer',timer);

    	text.anchor.set(0.5);

	},

	update: function () {
		text.setText("Game Starting in " + timer);
		if (timer <= 0){
			this.state.start('Game');
			
		}
	}

};
