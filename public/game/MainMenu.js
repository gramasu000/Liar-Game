
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.hostGameButton = null;
	this.joinGameButton = null;
	this.howToPlayButton = null;
	this.disconnectedMessage = null;

};

var disconnect = false;

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.titlePage = this.add.sprite(0, 0, 'titlepage');
		this.titlePage.width = 800;
		this.titlePage.height = 650;

		this.hostGameButton = this.add.button(328, 405, 'hostGameButton', this.hostGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.hostGameButton.width = 144;
        this.hostGameButton.height = 40;

        this.joinGameButton = this.add.button(328, 446, 'joinGameButton', this.joinGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.joinGameButton.width = 144;
        this.joinGameButton.height = 40;

        this.howToPlayButton = this.add.button(328, 487, 'howToPlayButton', this.howToPlay, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.howToPlayButton.width = 144;
        this.howToPlayButton.height = 40;

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
	}

};
