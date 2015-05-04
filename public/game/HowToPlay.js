BasicGame.HowToPlay = function(game){
	this.howToPlayBackground = null;
	this.backButton = null;
}

BasicGame.HowToPlay.prototype = {

	preload: function () {
		// this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
  //       this.waitingRoomBackground.width = 800;
  //       this.waitingRoomBackground.height = 600;

        this.backButton = this.add.button(30,500,'backButton',this.backToMainMenu,this);
	},

	create: function () {

		var style = { font: "60px Arial", fill: "#ff0044", align: "center" };

    	text = game.add.text(game.world.centerX, game.world.centerY, 
    		"Hello", style);

    	text.anchor.set(0.5);

	},

	update: function () {

	},

	backToMainMenu: function(){
		this.state.start('MainMenu');
	}

};
