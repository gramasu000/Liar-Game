BasicGame.HostRoom = function (game) {
	
	this.hostRoomBackground = null;
	this.backButton = null;
	this.leftKey = null;
}

BasicGame.HostRoom.prototype = {

	preload: function () {
		this.hostRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.hostRoomBackground.width = 800;
        this.hostRoomBackground.height = 600;

        this.backButton = this.add.button(30,500,'backButton',this.backToMainMenu,this);
	},

	create: function () {
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.leftKey.onDown.add(this.backToMainMenu, this);

		$(".hRoom").show();
		$("#hostRoomInput").focus();

	},

	update: function () {

	},

	backToMainMenu: function(){
		$("#hostRoomInput").val('');
		$("#hostRoomInput").hide();
		$("#hostRoom").hide();
		this.state.start('MainMenu');
	}

};
