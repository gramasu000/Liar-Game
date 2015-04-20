BasicGame.HostRoom = function (game) {
	
	this.hostRoomBackground = null;
}

BasicGame.HostRoom.prototype = {

	preload: function () {
		this.hostRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.hostRoomBackground.width = 800;
        this.hostRoomBackground.height = 600;

        this.backButton = this.add.button(30,500,'backButton',this.backToMainMenu,this);
	},

	create: function () {

		$(".hRoom").show();

	},

	update: function () {

	},

	backToMainMenu: function(){
		$("#hostRoomInput").hide();
		$("#hostRoom").hide();
		this.state.start('MainMenu');
	}

};
