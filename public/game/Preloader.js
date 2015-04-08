
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(150, 200, 'preloaderBar');
		this.background.width = 800;
		this.background.height = 600;

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.

		// Assets for the Main Menu State
		this.load.image('titlepage', 'assets/exampleBackground.jpg');
		this.load.image('hostGameButton', 'assets/hostGame.png');
		this.load.image('joinGameButton', 'assets/joinGame.png');
		this.load.image('roomButton', 'assets/roomButton.png');
		this.load.image('backButton', 'assets/backButton.png');
		this.load.audio('titleMusic', 'assets/mainMenu.mp3');

		// Assets for the Set Pseudo State

		// Assets for the Game State
		this.load.image('gameBackground','assets/gameBackground.jpeg');
		this.load.image('kingdom','assets/kingdom.gif');
		this.load.image('defend', 'assets/defend.png');
		this.load.image('attack','assets/attack.png');
		this.load.image('submit', 'assets/submit.png');

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
