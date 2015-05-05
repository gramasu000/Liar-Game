BasicGame.HowToPlay = function(game){
	this.howToPlayBackground = null;
	this.backButton = null;
	this.previousButton = null;
	this.nextButton = null;
	this.pageNumber = 0;

	this.leftKey = null;
	this.rightKey = null;
	this.downKey = null;

	this.attack_buttons = null;
	this.defend_buttons = null;

	this.kingdom = null;
	this.defend_sprites = null;
	this.attack_sprites = null;

	this.pages = [];
}

BasicGame.HowToPlay.prototype = {

	preload: function () {
		// this.waitingRoomBackground = this.add.sprite(0,0,'gameBackground');
  //       this.waitingRoomBackground.width = 800;
  //       this.waitingRoomBackground.height = 600;

        this.backButton = this.add.button(360,540,'backButton',this.backToMainMenu,this);
        this.previousButton = this.add.button(30,540,'previousButton',this.goToPreviousPage,this);
        this.previousButton.visible = false;
        this.nextButton = this.add.button(685,540,'nextButton',this.goToNextPage,this);
	},

	create: function () {
		this.pageNumber = 0;

		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey.onDown.add(this.goToPreviousPage, this);
        this.rightKey.onDown.add(this.goToNextPage, this);
        this.downKey.onDown.add(this.backToMainMenu, this);

		var style0 = { font: "28px Arial", fill: "#ffffff", align: "center" };
		var page0 = "Congratulations, you are now entering the LIAR GAME. \nThank you for participating! \n\nIn this game, you are given a kingdom and must attack and defend against 3 other kingdoms to come out on top. This is a turn-based game of strategy and manipulation. You must input your decisions within a time limit in a turn. There will be some time when the results of all actions are shown. Then the next turn begins.";
    	this.pages[0] = game.add.group();
    	game.add.text(game.world.centerX, game.world.centerY, page0, style0, this.pages[0]);

    	this.pages[0].setAll('anchor.x',0.5);
    	this.pages[0].setAll('anchor.y',0.5);
    	this.pages[0].setAll('wordWrap',true);
    	this.pages[0].setAll('wordWrapWidth',window.innerWidth-550);

    	var style1 = { font: "24px Arial", fill: "#ffffff", align: "center" };
    	var page1 = "There are 4 actions you can do against each player.";
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
    	this.pages[1].setAll('visible',false);


    	this.attack_buttons = game.add.group();
    	var a0 = this.add.sprite(80,160,'attack');
    	var a1 = this.add.sprite(470,160,'attack');
    	var a2 = this.add.sprite(80,400,'attack');
    	var a3 = this.add.sprite(470,400,'attack');
    	a0.tint = 0x794044;
    	a1.tint = 0xFFFFFF;
    	a2.tint = 0x794044;
    	a3.tint = 0xFFFFFF;
    	this.attack_buttons.add(a0);
    	this.attack_buttons.add(a1);
    	this.attack_buttons.add(a2);
    	this.attack_buttons.add(a3);

    	this.attack_buttons.setAll('anchor.x',0.5);
    	this.attack_buttons.setAll('anchor.y',0.5);
    	this.attack_buttons.setAll('width',100);
    	this.attack_buttons.setAll('height',100);
    	this.attack_buttons.setAll('rotation',3*Math.PI/2);
    	this.attack_buttons.setAll('visible',false);

    	this.defend_buttons = game.add.group();
    	var d0 = this.add.sprite(80,230,'defend');
    	var d1 = this.add.sprite(470,230,'defend');
    	var d2 = this.add.sprite(80,470,'defend');
    	var d3 = this.add.sprite(470,470,'defend');
    	d0.tint = 0x794044;
    	d1.tint = 0x794044;
    	d2.tint = 0xFFFFFF;
    	d3.tint = 0xFFFFFF;
    	this.defend_buttons.add(d0);
    	this.defend_buttons.add(d1);
    	this.defend_buttons.add(d2);
    	this.defend_buttons.add(d3);

    	this.defend_buttons.setAll('anchor.x',0.5);
    	this.defend_buttons.setAll('anchor.y',0.5);
    	this.defend_buttons.setAll('width',100);
    	this.defend_buttons.setAll('height',20);
    	this.defend_buttons.setAll('visible',false);


        var style2 = { font: "18px Arial", fill: "#ffffff", align: "center" };
    	var page2 = "Each action costs 1 life point. A successful attack, meaning an attack that does not get defended against, inflict 3 points of damage. An attack that gets blocked inflicts no damage."
    	var nothing2 = "PROS:\n No life lost from using actions!\nCONS:\n Vulnerable to attacks";
    	var attack2 = "PROS:\n Can cause 3 points of damage \nCONS:\n Uses 1 life point\nVulnerable to attacks";
    	var defend2 = "PROS:\n Invulnerable to attack\nCONS:\n Uses 1 life point";
    	var attackAndDefend2 = "PROS:\n PROS of both attack and defend \nCONS:\n Uses 2 life points!";

    	this.pages[2] = game.add.group();
    	var topText = game.add.text(game.world.centerX, 50, page2, style2, this.pages[2]);
    	game.add.text(270, 180, nothing2, style2, this.pages[2]);
    	game.add.text(660, 180, attack2, style2, this.pages[2]);
    	game.add.text(270, 420, defend2, style2, this.pages[2]);
    	game.add.text(660, 420, attackAndDefend2, style2, this.pages[2]);

    	this.pages[2].setAll('anchor.x',0.5);
    	this.pages[2].setAll('anchor.y',0.5);
    	this.pages[2].setAll('wordWrap',true);
    	this.pages[2].setAll('wordWrapWidth', 200);
    	this.pages[2].setAll('visible',false);
    	topText.wordWrapWidth = window.innerWidth-550;

    	var page3 = "Remember that there are THREE other players!\n An action only corresponds to one other player.\n This means you can perform up to SIX actions, but remember that each action will cost you one life point each!\n\nYou also have access to a chat messenger on the side once you enter the game. Take advantage!\n\n Good luck!";

    	this.pages[3] = game.add.group();
    	game.add.text(game.world.centerX, game.world.centerY-50, page3, style1, this.pages[3]);

    	this.pages[3].setAll('anchor.x',0.5);
    	this.pages[3].setAll('anchor.y',0.5);
    	this.pages[3].setAll('wordWrap',true);
    	this.pages[3].setAll('wordWrapWidth', window.innerWidth-550);
    	this.pages[3].setAll('visible',false);

    	this.kingdom = game.add.group();
    	var k0 = this.add.sprite(400,530,'kingdom');
    	var k1 = this.add.sprite(70,300,'kingdom');
    	var k2 = this.add.sprite(400,70,'kingdom');
    	var k3 = this.add.sprite(730,300,'kingdom');

    	k0.height = 100;
    	k1.height = 80;
    	k2.height = 100;
    	k3.height = 80;

    	k1.rotation = Math.PI/2;
    	k2.rotation = Math.PI;
    	k3.rotation = 3*Math.PI/2;

    	this.kingdom.add(k0);
    	this.kingdom.add(k1);
    	this.kingdom.add(k2);
    	this.kingdom.add(k3);

    	this.kingdom.setAll('anchor.x',0.5);
    	this.kingdom.setAll('anchor.y',0.5);
    	this.kingdom.setAll('width',300);
    	this.kingdom.setAll('alpha',0.2);
    	this.kingdom.setAll('visible',false);

        this.defend_sprites = game.add.group();
        var ds0 = this.add.sprite(130, 300, 'defend');
        var ds1 = this.add.sprite(85, 170, 'defend');
        var ds2 = this.add.sprite(85, 430, 'defend');
        var ds3 = this.add.sprite(400, 150, 'defend');
        var ds4 = this.add.sprite(540, 80, 'defend');
        var ds5 = this.add.sprite(260, 80, 'defend');
        var ds6 = this.add.sprite(670, 300, 'defend');
        var ds7 = this.add.sprite(715, 430, 'defend');
        var ds8 = this.add.sprite(715, 170, 'defend');
        var ds9 = this.add.sprite(260,510,'defend');
        var ds10 = this.add.sprite(400,450,'defend');
        var ds11 = this.add.sprite(540,510,'defend');

        ds0.rotation = Math.PI/2;
        ds1.rotation = Math.PI - 2.35;
        ds2.rotation = 2.35;
        ds4.rotation = 2.23;
        ds5.rotation = Math.PI - 2.23;
        ds6.rotation = Math.PI/2;
        ds7.rotation = Math.PI - 2.35;
        ds8.rotation = 2.35;
        ds9.rotation = 2.23;
        ds11.rotation = Math.PI - 2.23;

        this.defend_sprites.add(ds0);
        this.defend_sprites.add(ds1);
        this.defend_sprites.add(ds2);
        this.defend_sprites.add(ds3);
        this.defend_sprites.add(ds4);
        this.defend_sprites.add(ds5);
        this.defend_sprites.add(ds6);
        this.defend_sprites.add(ds7);
        this.defend_sprites.add(ds8);
        this.defend_sprites.add(ds9);
        this.defend_sprites.add(ds10);
        this.defend_sprites.add(ds11);

        this.defend_sprites.setAll('anchor.x',0.5);
        this.defend_sprites.setAll('anchor.y',0.5);
        this.defend_sprites.setAll('width',100);
        this.defend_sprites.setAll('height',20);
        this.defend_sprites.setAll('alpha',0.2);
        this.defend_sprites.setAll('visible',false);
        
        
        this.attack_sprites = game.add.group();
        var as0 = this.add.sprite(200, 300, 'attack');
        var as1 = this.add.sprite(120, 140, 'attack');
        var as2 = this.add.sprite(120, 460, 'attack');
        var as3 = this.add.sprite(400, 220, 'attack');
        var as4 = this.add.sprite(575, 105, 'attack');
        var as5 = this.add.sprite(225, 105, 'attack');
        var as6 = this.add.sprite(600, 300, 'attack');
        var as7 = this.add.sprite(680, 460, 'attack');
        var as8 = this.add.sprite(680, 140, 'attack');
        var as9 = this.add.sprite(225,485,'attack');
        var as10 = this.add.sprite(400,380,'attack');
        var as11 = this.add.sprite(575,485,'attack');

        as1.rotation = Math.PI + 2.35;
        as2.rotation = Math.PI - 2.35;
        as3.rotation = Math.PI/2;
        as4.rotation = Math.PI - 2.5;
        as5.rotation = 2.5;
        as6.rotation = Math.PI;
        as7.rotation = 2.35;
        as8.rotation = 2*Math.PI - 2.35;
        as9.rotation = 2*Math.PI - 2.5;
        as10.rotation = 3*Math.PI/2;
        as11.rotation = Math.PI + 2.5;

        as0.width = 100;
        as1.width = 50;
        as2.width = 50;
        as3.width = 100;
        as4.width = 50;
        as5.width = 50;
        as6.width = 100;
        as7.width = 50;
        as8.width = 50;
        as9.width = 50;
        as10.width = 100;
        as11.width = 50;

        this.attack_sprites.add(as0);
        this.attack_sprites.add(as1);
        this.attack_sprites.add(as2);
        this.attack_sprites.add(as3);
        this.attack_sprites.add(as4);
        this.attack_sprites.add(as5);
        this.attack_sprites.add(as6);
        this.attack_sprites.add(as7);
        this.attack_sprites.add(as8);
        this.attack_sprites.add(as9);
        this.attack_sprites.add(as10);
        this.attack_sprites.add(as11);

        this.attack_sprites.setAll('anchor.x',0.5);
        this.attack_sprites.setAll('anchor.y',0.5);
        this.attack_sprites.setAll('height',100);
        this.attack_sprites.setAll('alpha',0.2);
        this.attack_sprites.setAll('visible',false);
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

			this.attack_buttons.setAll('visible',false);
			this.defend_buttons.setAll('visible',false);

			this.kingdom.setAll('visible',false);
			this.attack_sprites.setAll('visible',false);
			this.defend_sprites.setAll('visible',false);	

			if (this.pageNumber == this.pages.length-1){
				this.nextButton.visible = false;
			}
			if (this.pageNumber == 1 || this.pageNumber == 2){
				this.attack_buttons.setAll('visible',true);
				this.defend_buttons.setAll('visible',true);
			}
			else if (this.pageNumber == 3){
				this.kingdom.setAll('visible',true);
				this.attack_sprites.setAll('visible',true);
				this.defend_sprites.setAll('visible',true);
			}
		}
	},

	goToPreviousPage: function(){
		if (this.pageNumber != 0){
			this.pages[this.pageNumber--].setAll('visible',false);
			this.pages[this.pageNumber].setAll('visible',true);
			this.nextButton.visible = true;

			this.attack_buttons.setAll('visible',false);
			this.defend_buttons.setAll('visible',false);
			this.kingdom.setAll('visible',false);
			this.attack_sprites.setAll('visible',false);
			this.defend_sprites.setAll('visible',false);

			if (this.pageNumber == 0){
				this.previousButton.visible = false;
			}
			else if (this.pageNumber == 1 || this.pageNumber == 2){
				this.attack_buttons.setAll('visible',true);
				this.defend_buttons.setAll('visible',true);
			}
			else if (this.pageNumber == 3){
				this.kingdom.setAll('visible',true);
				this.attack_sprites.setAll('visible',true);
				this.defend_sprites.setAll('visible',true);
			}
		}
	}

};
