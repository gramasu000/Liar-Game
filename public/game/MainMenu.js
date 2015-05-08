
BasicGame.MainMenu = function (game) {

	this.music = null;
	
	this.hostGameButton = null;
	this.joinGameButton = null;
	this.howToPlayButton = null;
	this.keyboardControlButton = null;

	this.buttonGroup = null;
	this.arrowGroup = null;

	this.currentArrow = 0;

	this.disconnectedMessage = null;

	this.upKey = null;
	this.downKey = null;
	this.enterKey = null;

};

var disconnect = false;

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.upKey.onDown.add(this.moveUp, this);
		this.downKey.onDown.add(this.moveDown, this);
		this.enterKey.onDown.add(this.enterNewState, this);

		this.titlePage = this.add.sprite(0, 0, 'titlepage');
		this.titlePage.width = 800;
		this.titlePage.height = 650;

		this.arrowGroup = this.add.group();
		this.arrowGroup.create(305,430,'arrowMarker');
		this.arrowGroup.create(305,475,'arrowMarker');
		this.arrowGroup.create(305,520,'arrowMarker');
		this.arrowGroup.create(305,565,'arrowMarker');
		this.arrowGroup.setAll('anchor.x',0.5);
		this.arrowGroup.setAll('anchor.y',0.5);
		this.arrowGroup.setAll('width',50);
		this.arrowGroup.setAll('height',50);
		this.arrowGroup.setAll('visible',false);
		this.arrowGroup.children[0].visible = true;

		this.currentArrow = 0;

		this.buttonGroup = this.add.group();

		this.hostGameButton = this.add.button(400, 430, 'hostGameButton', this.hostGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

        this.joinGameButton = this.add.button(400, 475, 'joinGameButton', this.joinGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

        this.howToPlayButton = this.add.button(400, 520, 'howToPlayButton', this.howToPlay, this, 'buttonOver', 'buttonOut', 'buttonOver');

        this.keyboardControlButton = this.add.button(400, 565, 'keyboardControlButton', this.keyboardControl, this, 'buttonOver', 'buttonOut', 'buttonOver');
        
        this.buttonGroup.add(this.hostGameButton);
        this.buttonGroup.add(this.joinGameButton);
        this.buttonGroup.add(this.howToPlayButton);
        this.buttonGroup.add(this.keyboardControlButton);

        this.buttonGroup.setAll('anchor.x',0.5);
        this.buttonGroup.setAll('anchor.y',0.5);
        this.buttonGroup.setAll('height',40);
        this.buttonGroup.setAll('width',140);

        if (disconnect)
        {
        	this.disconnectedMessage = this.add.text(400, 50, "A Player Has Disconnected", {font: "32px Arial", fill: "#000000" });
        	this.disconnectedMessage.anchor = new Phaser.Point(0.5,0.5);
        	disconnect = false;
        }
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	moveUp: function(){
		this.arrowGroup.setAll('visible',false);
		var arrows = this.arrowGroup.children;
		var length = arrows.length;
		this.currentArrow += 3;
		this.currentArrow %= length;
		arrows[this.currentArrow].visible = true;
	},

	moveDown: function(){
		this.arrowGroup.setAll('visible',false);
		var arrows = this.arrowGroup.children;
		var length = arrows.length;
		this.currentArrow++;
		this.currentArrow %= length;
		arrows[this.currentArrow].visible = true;
	},

	hostGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();
		//	And let player host a game room
		this.state.start('HostRoom');

	},

	joinGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//Initialize rooms
		socket.emit('initializeRooms',null);

		//	And go to the room list
		this.state.start('JoinRoom');
	},

	howToPlay: function(pointer){
		this.music.stop();
		this.state.start('HowToPlay');
	},

	keyboardControl: function(pointer){
		this.music.stop();
		this.state.start('KeyboardControl');
	},

	enterNewState: function(){
		if (this.currentArrow == 0){
			this.hostGame();
		}
		else if (this.currentArrow == 1){
			this.joinGame();
		}
		else if (this.currentArrow == 2){
			this.howToPlay();
		}
		else {
			this.keyboardControl();
		}
	}

};
