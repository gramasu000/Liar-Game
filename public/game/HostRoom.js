BasicGame.HostRoom = function (game) {
	
	this.hostRoomBackground = null;
}

BasicGame.HostRoom.prototype = {

	preload: function () {
		this.hostRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.hostRoomBackground.width = 800;
        this.hostRoomBackground.height = 600;
	},

	create: function () {

		$(".hRoom").show();

	},

	update: function () {

	}

};
