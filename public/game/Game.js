
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.gameBackground = null;
    this.kingdom = {};
    this.defend_sprites = {};
    this.defend_buttons = {};
    this.attack_sprites = {};
    this.attack_buttons = {};
    this.selftext = null

};

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!\

        // Background
        this.gameBackground = this.add.sprite(0,0,'gameBackground');
        this.gameBackground.width = 800;
        this.gameBackground.height = 600;

        // Your kingdom
        this.kingdom[0] = this.add.sprite(400,530,'kingdom');
        this.kingdom[0].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom[0].width = 300;
        this.kingdom[0].height = 100;

        // Three other kingdoms
        this.kingdom[1] = this.add.sprite(70,300,'kingdom');
        this.kingdom[1].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom[1].width = 300;
        this.kingdom[1].height = 80;
        this.kingdom[1].rotation = Math.PI / 2;
        this.kingdom[1].tint = 0x794044;

        this.kingdom[2] = this.add.sprite(400,70,'kingdom');
        this.kingdom[2].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom[2].width = 300;
        this.kingdom[2].height = 100;
        this.kingdom[2].rotation = Math.PI;
        this.kingdom[2].tint = 0x794044;
        
        this.kingdom[3] = this.add.sprite(730,300,'kingdom');
        this.kingdom[3].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom[3].width = 300;
        this.kingdom[3].height = 80;
        this.kingdom[3].rotation = 3*(Math.PI / 2);
        this.kingdom[3].tint = 0x794044;

        // Defend sprites for other kingdoms
        this.defend_sprites[0] = this.add.sprite(130, 300, 'defend');
        this.defend_sprites[0].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[0].width = 100;
        this.defend_sprites[0].height = 20;
        this.defend_sprites[0].rotation = Math.PI/2;

        this.defend_sprites[1] = this.add.sprite(85, 170, 'defend');
        this.defend_sprites[1].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[1].width = 100;
        this.defend_sprites[1].height = 20;
        this.defend_sprites[1].rotation = Math.PI - 2.35;

        this.defend_sprites[2] = this.add.sprite(85, 430, 'defend');
        this.defend_sprites[2].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[2].width = 100;
        this.defend_sprites[2].height = 20;
        this.defend_sprites[2].rotation = 2.35;

        this.defend_sprites[3] = this.add.sprite(400, 150, 'defend');
        this.defend_sprites[3].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[3].width = 100;
        this.defend_sprites[3].height = 20;

        this.defend_sprites[4] = this.add.sprite(540, 80, 'defend');
        this.defend_sprites[4].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[4].width = 100;
        this.defend_sprites[4].height = 20;
        this.defend_sprites[4].rotation = 2.23;

        this.defend_sprites[5] = this.add.sprite(260, 80, 'defend');
        this.defend_sprites[5].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[5].width = 100;
        this.defend_sprites[5].height = 20;
        this.defend_sprites[5].rotation = Math.PI - 2.23;

        this.defend_sprites[6] = this.add.sprite(670, 300, 'defend');
        this.defend_sprites[6].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[6].width = 100;
        this.defend_sprites[6].height = 20;
        this.defend_sprites[6].rotation = Math.PI/2;

        this.defend_sprites[7] = this.add.sprite(715, 430, 'defend');
        this.defend_sprites[7].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[7].width = 100;
        this.defend_sprites[7].height = 20;
        this.defend_sprites[7].rotation = Math.PI - 2.35;

        this.defend_sprites[8] = this.add.sprite(715, 170, 'defend');
        this.defend_sprites[8].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[8].width = 100;
        this.defend_sprites[8].height = 20;
        this.defend_sprites[8].rotation = 2.35;


        // Defend BUTTONS for YOUR kingdom
        this.defend_buttons[0] = this.add.button(400,450,'defend',this.quitGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.defend_buttons[0].anchor = new Phaser.Point(0.5,0.5);
        this.defend_buttons[0].width = 100;
        this.defend_buttons[0].height = 20;

        this.defend_buttons[1] = this.add.button(540,510,'defend',this.quitGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.defend_buttons[1].anchor = new Phaser.Point(0.5,0.5);
        this.defend_buttons[1].width = 100;
        this.defend_buttons[1].height = 20;
        this.defend_buttons[1].rotation = Math.PI - 2.23
        
        this.defend_buttons[2] = this.add.button(260,510,'defend',this.quitGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.defend_buttons[2].anchor = new Phaser.Point(0.5,0.5);
        this.defend_buttons[2].width = 100;
        this.defend_buttons[2].height = 20;
        this.defend_buttons[2].rotation = 2.23

        // Attack sprites for other kingdoms
        this.attack_sprites[0] = this.add.sprite(200, 300, 'attack');
        this.attack_sprites[0].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[0].width = 100;
        this.attack_sprites[0].height = 100;

        this.attack_sprites[1] = this.add.sprite(120, 140, 'attack');
        this.attack_sprites[1].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[1].width = 50;
        this.attack_sprites[1].height = 100;
        this.attack_sprites[1].rotation = Math.PI + 2.35

        this.attack_sprites[2] = this.add.sprite(120, 460, 'attack');
        this.attack_sprites[2].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[2].width = 50;
        this.attack_sprites[2].height = 100;
        this.attack_sprites[2].rotation = Math.PI - 2.35

        this.attack_sprites[3] = this.add.sprite(400, 220, 'attack');
        this.attack_sprites[3].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[3].width = 100;
        this.attack_sprites[3].height = 100;
        this.attack_sprites[3].rotation = Math.PI/2;

        this.attack_sprites[4] = this.add.sprite(575, 105, 'attack');
        this.attack_sprites[4].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[4].width = 50;
        this.attack_sprites[4].height = 100;
        this.attack_sprites[4].rotation = Math.PI - 2.5;

        this.attack_sprites[5] = this.add.sprite(225, 105, 'attack');
        this.attack_sprites[5].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[5].width = 50;
        this.attack_sprites[5].height = 100;
        this.attack_sprites[5].rotation = 2.5;

        this.attack_sprites[6] = this.add.sprite(600, 300, 'attack');
        this.attack_sprites[6].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[6].width = 100;
        this.attack_sprites[6].height = 100;
        this.attack_sprites[6].rotation = Math.PI;

        this.attack_sprites[7] = this.add.sprite(680, 140, 'attack');
        this.attack_sprites[7].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[7].width = 50;
        this.attack_sprites[7].height = 100;
        this.attack_sprites[7].rotation = (2*Math.PI) - 2.35

        this.attack_sprites[8] = this.add.sprite(680, 460, 'attack');
        this.attack_sprites[8].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[8].width = 50;
        this.attack_sprites[8].height = 100;
        this.attack_sprites[8].rotation = 2.35

        this.attack_buttons[0] = this.add.button(400, 380, 'attack', this.quitGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.attack_buttons[0].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_buttons[0].width = 100;
        this.attack_buttons[0].height = 100;
        this.attack_buttons[0].rotation = 3*Math.PI / 2;

        this.attack_buttons[1] = this.add.button(575, 485, 'attack', this.quitGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.attack_buttons[1].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_buttons[1].width = 50;
        this.attack_buttons[1].height = 100;
        this.attack_buttons[1].rotation = 2.5 + Math.PI;

        this.attack_buttons[2] = this.add.button(225, 485, 'attack', this.quitGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.attack_buttons[2].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_buttons[2].width = 50;
        this.attack_buttons[2].height = 100;
        this.attack_buttons[2].rotation = 2*Math.PI - 2.5;



    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
