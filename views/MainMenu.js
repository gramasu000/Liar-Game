
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.titlePage = null;
	this.playButton = null;

};

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

		this.playButton = this.add.button(300, 200, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
		this.playButton.width = 200;
		this.playButton.height = 100;
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
