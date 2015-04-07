BasicGame.JoinRoom = function (game) {
	
	this.joinRoomBackground = null;
}

BasicGame.JoinRoom.prototype = {

	preload: function () {
		this.joinRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.joinRoomBackground.width = 800;
        this.joinRoomBackground.height = 600;
	},

	create: function () {

		$(".jRoom").show();

	},

	update: function () {

	}

};
