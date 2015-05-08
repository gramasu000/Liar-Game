BasicGame.KeyboardControl = function(game){
	this.backButton = null;
	this.previousButton = null;
	this.nextButton = null;
	this.pageNumber = 0;

	this.leftKey = null;
	this.rightKey = null;
	this.downKey = null;

	this.pages = [];
}

BasicGame.KeyboardControl.prototype = {

	preload: function () {
		// this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
  //       this.waitingRoomBackground.width = 800;
  //       this.waitingRoomBackground.height = 600;

        this.backButton = this.add.button(360,540,'backButton',this.backToMainMenu,this);
        this.previousButton = this.add.button(30,540,'previousButton',this.goToPreviousPage,this);
        this.previousButton.visible = false;
        this.nextButton = this.add.button(685,540,'nextButton',this.goToNextPage,this);
        this.nextButton.visible = false;
	},

	create: function () {
		this.pageNumber = 0;

		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey.onDown.add(this.goToPreviousPage, this);
        this.rightKey.onDown.add(this.goToNextPage, this);
        this.downKey.onDown.add(this.backToMainMenu, this);

		var style0 = { font: "28px Courier", fill: "#ffffff", align: "center" };
        var style1 = { font: "16px Courier", fill: "#ffffff"};

		var page0 = "General Keyboard Controls";
        var page01 = "Controls for Game";
        var page02 = "Controls for Chat";
        var generalDescriptions = "LEFT - selects button on lower left corner if there is one\n" +
             "DOWN - selects button on bottom side if there is one\n" +
             "RIGHT - selects button on lower right corner if there is one\n" +
             "ENTER - selects button the arrow is hovering next to if arrow exists";
        var gameDescriptions = "ESC - toggles to the chat\n" +
            "UP - moves up among actions\n" + 
            "DOWN - moves down among actions\n" + 
            "LEFT - moves left among actions\n" + 
            "RIGHT - moves right among actions\n" + 
            "SHIFT - submits actions\n" + 
            "ENTER - chooses and unchooses actions";
        var chatDescriptions = "ESC - toggles to the game\n" +
            "UP - moves up in player list\n" + 
            "DOWN - moves down in player list\n" +
            "ENTER - send message to selected player";
    	this.pages[0] = game.add.group();
    	game.add.text(game.world.centerX, 50, page0, style0, this.pages[0]);
        game.add.text(200, 270, page01, style0, this.pages[0]);
        game.add.text(560, 270, page02, style0, this.pages[0]);
        game.add.text(game.world.centerX, 150, generalDescriptions, style1, this.pages[0]);
        var gameControls = game.add.text(230, 380, gameDescriptions, style1, this.pages[0]);
        var chatControls = game.add.text(605, 345, chatDescriptions, style1, this.pages[0]);

    	this.pages[0].setAll('anchor.x',0.5);
    	this.pages[0].setAll('anchor.y',0.5);
    	this.pages[0].setAll('wordWrap',true);
    	this.pages[0].setAll('wordWrapWidth',window.innerWidth-530);
        //gameControls.wordWrapWidth = 400;
        //chatControls.wordWrapWidth = 400;

    	/*var page1 = "Keyboard Controls in General";
    	var nothing1 = "Nothing at all!";
    	var attack1 = "Just Attack!";
    	var defend1 = "Just Defend!";
    	var attackAndDefend1 = "Attack AND Defend!";
    	this.pages[1] = game.add.group(); 
    	game.add.text(game.world.centerX, 40, page1, style1, this.pages[1]);
    	game.add.text(270, 180, nothing1, style1, this.pages[1]);
    	game.add.text(660, 180, attack1, style1, this.pages[1]);
    	game.add.text(270, 420, defend1, style1, this.pages[1]);
    	game.add.text(660, 420, attackAndDefend1, style1, this.pages[1]);

    	this.pages[1].setAll('anchor.x',0.5);
    	this.pages[1].setAll('anchor.y',0.5);
    	this.pages[1].setAll('wordWrap',true);
    	this.pages[1].setAll('wordWrapWidth',window.innerWidth-550);
    	this.pages[1].setAll('visible',false);*/

	},

	update: function () {

	},

	backToMainMenu: function(){
		this.state.start('MainMenu');
	},

	goToNextPage: function(){
		if (this.pageNumber != this.pages.length-1){
			this.pages[this.pageNumber++].setAll('visible',false);
			this.pages[this.pageNumber].setAll('visible',true);
			this.previousButton.visible = true;

			if (this.pageNumber == this.pages.length-1){
				this.nextButton.visible = false;
			}
		}
	},

	goToPreviousPage: function(){
		if (this.pageNumber != 0){
			this.pages[this.pageNumber--].setAll('visible',false);
			this.pages[this.pageNumber].setAll('visible',true);
			this.nextButton.visible = true;

			if (this.pageNumber == 0){
				this.previousButton.visible = false;
			}
		}
	}

};
