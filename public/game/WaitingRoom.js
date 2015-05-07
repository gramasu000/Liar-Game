BasicGame.WaitingRoom = function (game) {
	
	this.waitingRoomBackground = null;
	this.backButton = null;
	this.roomName = null;
	this.leftKey = null;
}

var text;
var numPlayersRemaining = 3;
var timer = 10;

socket.on('playerCount',function(data){
	numPlayersRemaining = data;
});

BasicGame.WaitingRoom.prototype = {
	init: function (name){
		this.roomName = name;
	},

	preload: function () {
		this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.waitingRoomBackground.width = 800;
        this.waitingRoomBackground.height = 600;

        this.backButton = this.add.button(30,500,'backButton',this.backToMainMenu,this);

        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.leftKey.onDown.add(this.backToMainMenu, this);
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
			this.state.start('SetPseudo');
		}
	},

	backToMainMenu: function(){
		$('#joinRoomInput').hide();
        $('#joinRoom').hide();
        $('#joinRoomInput').val('');
        $('#hostRoomInput').val('');
        socket.emit('exitRoom',this.roomName);
		this.state.start('MainMenu');
	}

};
