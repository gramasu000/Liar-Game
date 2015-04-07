BasicGame.WaitingRoom = function (game) {
	
	this.waitingRoomBackground = null;
}

BasicGame.WaitingRoom.prototype = {

	preload: function () {
		this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.waitingRoomBackground.width = 800;
        this.waitingRoomBackground.height = 600;
	},

	create: function () {

		var style = { font: "60px Arial", fill: "#ff0044", align: "center" };

    	var text = game.add.text(game.world.centerX, game.world.centerY, "Waiting for more players", style);

    	text.anchor.set(0.5);

	},

	update: function () {

	}

};
