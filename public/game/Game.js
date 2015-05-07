
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

    this.keycontrlgame;
    this.upKey;
    this.downKey;
    this.leftKey;
    this.rightKey;
    this.shiftkey;
    this.esckey;

    this.gameBackground;
    this.kingdom;
    this.kingdom_names;
    this.show_names;

    this.defend_sprites;
    this.defend_buttons;
    this.defend_booleans;
    
    this.attack_sprites;
    this.attack_buttons;

    this.attack_booleans;
    
    this.submit_button;
    this.submit_boolean;

    this.select;
    this.select_what;

    this.submit_messages; 
    this.timer_text;
    this.win_text;
    this.lose_text;

    this.backButton;

};

var health = {};
var record_actions;
var record;
var record_counter;
var gametimer;

var whoSubmitted = [false, false, false];
var otherPlayerDisconnect = [false, false, false];

socket.on('health', function(userhealth) {

    health = userhealth;
    console.log('Health recieved');
});

socket.on('record-actions', function(data) {

    record_actions = data;
    record = true;
    //record_counter = RESULTS_TIME;
    console.log("Actions Recieved");

});

socket.on('Gamecountdown', function(time){ gametimer = time; });
socket.on('Resultscountdown', function(time) { record_counter = time; });

socket.on('whoSubmitted', function(index) { 
    whoSubmitted[index] = true;
    console.log("Player " + index + " submitted " + whoSubmitted[index]);
}); 

socket.on('playerDisconnect', function(index) { 
    health[index] = 0;
    otherPlayerDisconnect[index] = true;
    console.log("Player " + index + " disconnected " + otherPlayerDisconnect[index]);

}); 


BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!


        // Initialize all variables
        this.keycontrlgame = true;

        this.gameBackground = null;
        this.kingdom = {};
        this.kingdom_names = {};
        this.show_names = [false, false, false];

        this.defend_sprites = {};
        this.defend_buttons = {};
        this.defend_booleans = {0: false, 1: false, 2:false };
        
        this.attack_sprites = {};
        this.attack_buttons = {};

        this.attack_booleans = {0: false, 1: false, 2:false };
        
        this.submit_button = null;
        this.submit_boolean = false; 
        this.submit_messages = {};

        this.select = [];
        this.select_what = -1;

        health["self"] = MAX_HEALTH;
        health[0] = MAX_HEALTH;
        health[1] = MAX_HEALTH;
        health[2] = MAX_HEALTH;

        record = false;
        gametimer = GAME_TIME;

        otherPlayerDisconnect = [false, false, false];
        whoSubmitted = [false, false, false];

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

        this.kingdom[2] = this.add.sprite(400,70,'kingdom');
        this.kingdom[2].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom[2].width = 300;
        this.kingdom[2].height = 100;
        this.kingdom[2].rotation = Math.PI;
        
        this.kingdom[3] = this.add.sprite(730,300,'kingdom');
        this.kingdom[3].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom[3].width = 300;
        this.kingdom[3].height = 80;
        this.kingdom[3].rotation = 3*(Math.PI / 2);

        // Defend sprites for other kingdoms
        this.defend_sprites[0] = this.add.sprite(130, 300, 'defend');
        this.defend_sprites[0].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[0].width = 100;
        this.defend_sprites[0].height = 20;
        this.defend_sprites[0].rotation = Math.PI/2;
        this.defend_sprites[0].visible = false;

        this.defend_sprites[1] = this.add.sprite(85, 170, 'defend');
        this.defend_sprites[1].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[1].width = 100;
        this.defend_sprites[1].height = 20;
        this.defend_sprites[1].rotation = Math.PI - 2.35;
        this.defend_sprites[1].visible = false;

        this.defend_sprites[2] = this.add.sprite(85, 430, 'defend');
        this.defend_sprites[2].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[2].width = 100;
        this.defend_sprites[2].height = 20;
        this.defend_sprites[2].rotation = 2.35;
        this.defend_sprites[2].visible = false;

        this.defend_sprites[3] = this.add.sprite(400, 150, 'defend');
        this.defend_sprites[3].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[3].width = 100;
        this.defend_sprites[3].height = 20;
        this.defend_sprites[3].visible = false;

        this.defend_sprites[4] = this.add.sprite(540, 80, 'defend');
        this.defend_sprites[4].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[4].width = 100;
        this.defend_sprites[4].height = 20;
        this.defend_sprites[4].rotation = 2.23;
        this.defend_sprites[4].visible = false;

        this.defend_sprites[5] = this.add.sprite(260, 80, 'defend');
        this.defend_sprites[5].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[5].width = 100;
        this.defend_sprites[5].height = 20;
        this.defend_sprites[5].rotation = Math.PI - 2.23;
        this.defend_sprites[5].visible = false;

        this.defend_sprites[6] = this.add.sprite(670, 300, 'defend');
        this.defend_sprites[6].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[6].width = 100;
        this.defend_sprites[6].height = 20;
        this.defend_sprites[6].rotation = Math.PI/2;
        this.defend_sprites[6].visible = false;

        this.defend_sprites[7] = this.add.sprite(715, 430, 'defend');
        this.defend_sprites[7].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[7].width = 100;
        this.defend_sprites[7].height = 20;
        this.defend_sprites[7].rotation = Math.PI - 2.35;
        this.defend_sprites[7].visible = false;

        this.defend_sprites[8] = this.add.sprite(715, 170, 'defend');
        this.defend_sprites[8].anchor = new Phaser.Point(0.5,0.5);
        this.defend_sprites[8].width = 100;
        this.defend_sprites[8].height = 20;
        this.defend_sprites[8].rotation = 2.35;
        this.defend_sprites[8].visible = false;
        

        // Defend BUTTONS for YOUR kingdom
        this.defend_buttons[0] = this.add.button(260,510,'defend',this.defend0, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.defend_buttons[0].anchor = new Phaser.Point(0.5,0.5);
        this.defend_buttons[0].width = 100;
        this.defend_buttons[0].height = 20;
        this.defend_buttons[0].rotation = 2.23;
        this.defend_buttons[0].tint = 0x794044;

        this.defend_buttons[1] = this.add.button(400,450,'defend',this.defend1, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.defend_buttons[1].anchor = new Phaser.Point(0.5,0.5);
        this.defend_buttons[1].width = 100;
        this.defend_buttons[1].height = 20;
        this.defend_buttons[1].tint = 0x794044;

        this.defend_buttons[2] = this.add.button(540,510,'defend',this.defend2, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.defend_buttons[2].anchor = new Phaser.Point(0.5,0.5);
        this.defend_buttons[2].width = 100;
        this.defend_buttons[2].height = 20;
        this.defend_buttons[2].rotation = Math.PI - 2.23;
        this.defend_buttons[2].tint = 0x794044;
        


        // Attack sprites for other kingdoms
        this.attack_sprites[0] = this.add.sprite(200, 300, 'attack');
        this.attack_sprites[0].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[0].width = 100;
        this.attack_sprites[0].height = 100;
        this.attack_sprites[0].visible = false;

        this.attack_sprites[1] = this.add.sprite(120, 140, 'attack');
        this.attack_sprites[1].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[1].width = 50;
        this.attack_sprites[1].height = 100;
        this.attack_sprites[1].rotation = Math.PI + 2.35;
        this.attack_sprites[1].visible = false;

        this.attack_sprites[2] = this.add.sprite(120, 460, 'attack');
        this.attack_sprites[2].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[2].width = 50;
        this.attack_sprites[2].height = 100;
        this.attack_sprites[2].rotation = Math.PI - 2.35;
        this.attack_sprites[2].visible = false;

        this.attack_sprites[3] = this.add.sprite(400, 220, 'attack');
        this.attack_sprites[3].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[3].width = 100;
        this.attack_sprites[3].height = 100;
        this.attack_sprites[3].rotation = Math.PI/2;
        this.attack_sprites[3].visible = false;

        this.attack_sprites[4] = this.add.sprite(575, 105, 'attack');
        this.attack_sprites[4].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[4].width = 50;
        this.attack_sprites[4].height = 100;
        this.attack_sprites[4].rotation = Math.PI - 2.5;
        this.attack_sprites[4].visible = false;

        this.attack_sprites[5] = this.add.sprite(225, 105, 'attack');
        this.attack_sprites[5].anchor = new Phaser.Point(0.5,0.5);
        this.attack_sprites[5].width = 50;
        this.attack_sprites[5].height = 100;
        this.attack_sprites[5].rotation = 2.5;
        this.attack_sprites[5].visible = false;

        this.attack_sprites[6] = this.add.sprite(600, 300, 'attack');
        this.attack_sprites[6].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[6].width = 100;
        this.attack_sprites[6].height = 100;
        this.attack_sprites[6].rotation = Math.PI;
        this.attack_sprites[6].visible = false;

        this.attack_sprites[7] = this.add.sprite(680, 460, 'attack');
        this.attack_sprites[7].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[7].width = 50;
        this.attack_sprites[7].height = 100;
        this.attack_sprites[7].rotation = 2.35
        this.attack_sprites[7].visible = false;

        this.attack_sprites[8] = this.add.sprite(680, 140, 'attack');
        this.attack_sprites[8].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_sprites[8].width = 50;
        this.attack_sprites[8].height = 100;
        this.attack_sprites[8].rotation = (2*Math.PI) - 2.35
        this.attack_sprites[8].visible = false;

        // Attack buttons for your kingdom
        this.attack_buttons[0] = this.add.button(225, 485, 'attack', this.attack0, this);
        this.attack_buttons[0].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_buttons[0].width = 50;
        this.attack_buttons[0].height = 100;
        this.attack_buttons[0].rotation = 2*Math.PI - 2.5;
        this.attack_buttons[0].tint = 0x794044;


        this.attack_buttons[1] = this.add.button(400, 380, 'attack', this.attack1, this);
        this.attack_buttons[1].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_buttons[1].width = 100;
        this.attack_buttons[1].height = 100;
        this.attack_buttons[1].rotation = 3*Math.PI / 2;
        this.attack_buttons[1].tint = 0x794044;

        this.attack_buttons[2] = this.add.button(575, 485, 'attack', this.attack2, this);
        this.attack_buttons[2].anchor = new Phaser.Point(0.5, 0.5);
        this.attack_buttons[2].width = 50;
        this.attack_buttons[2].height = 100;
        this.attack_buttons[2].rotation = 2.5 + Math.PI;
        this.attack_buttons[2].tint = 0x794044;

        // Submit Button
        this.submit_button = this.add.button(400,270, 'submit', this.submit, this, 1,1,0);
        this.submit_button.width = 200;
        this.submit_button.height = 100;
        this.submit_button.anchor = new Phaser.Point(0.5, 0.5);

        // Selection Rectangles
        this.select[0] = this.add.sprite(225, 485, 'select');
        this.select[0].anchor = new Phaser.Point(0.5, 0.5);
        this.select[0].width = 55;
        this.select[0].height = 105;
        this.select[0].rotation = 2*Math.PI - 2.5;
        this.select[0].visible = false;

        this.select[1] = this.add.sprite(260, 510, 'select');
        this.select[1].anchor = new Phaser.Point(0.5, 0.5);
        this.select[1].width = 105;
        this.select[1].height = 25;
        this.select[1].rotation = 2.23;
        this.select[1].visible = false;

        this.select[2] = this.add.sprite(400, 380, 'select');
        this.select[2].anchor = new Phaser.Point(0.5, 0.5);
        this.select[2].width = 105;
        this.select[2].height = 105;
        this.select[2].rotation = 3*Math.PI / 2;
        this.select[2].visible = false;

        this.select[3] = this.add.sprite(400, 450, 'select');
        this.select[3].anchor = new Phaser.Point(0.5, 0.5);
        this.select[3].width = 105;
        this.select[3].height = 25;
        this.select[3].visible = false;

        this.select[4] = this.add.sprite(575, 485, 'select');
        this.select[4].anchor = new Phaser.Point(0.5, 0.5);
        this.select[4].width = 55;
        this.select[4].height = 105;
        this.select[4].rotation = 2.5 + Math.PI;
        this.select[4].visible = false;

        this.select[5] = this.add.sprite(540, 510, 'select');
        this.select[5].anchor = new Phaser.Point(0.5, 0.5);
        this.select[5].width = 105;
        this.select[5].height = 25;
        this.select[5].rotation = Math.PI - 2.23;
        this.select[5].visible = false;

        // KEYBOARD CONTROLS
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.add(BasicGame.Game.prototype.select_up, this);

        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.downKey.onDown.add(BasicGame.Game.prototype.select_down, this);

        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.leftKey.onDown.add(BasicGame.Game.prototype.select_left, this);

        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.rightKey.onDown.add(BasicGame.Game.prototype.select_right, this);

        this.shiftkey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.shiftkey.onDown.add(BasicGame.Game.prototype.select, this);

        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(BasicGame.Game.prototype.enter_selection, this);

        this.esckey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.esckey.onDown.add(BasicGame.Game.prototype.toggleGC, this);

        // Display Your Name
        this.kingdom_names[0] = this.add.text(400, 530, self + ": " + health["self"], { font: "32px Arial", fill: "#000000" });
        this.kingdom_names[0].anchor = new Phaser.Point(0.5, 0.5);

        // Display Kingdom Names
        this.kingdom_names[1] = this.add.text(70, 300, otherusers[0] + ": " + health[0], { font: "32px Arial", fill: "#000000" });
        this.kingdom_names[1].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom_names[1].rotation = Math.PI/2;

        this.kingdom_names[2] = this.add.text(400, 70, otherusers[1] + ": " + health[1], { font: "32px Arial", fill: "#000000" });
        this.kingdom_names[2].anchor = new Phaser.Point(0.5, 0.5);

        this.kingdom_names[3] = this.add.text(730, 300, otherusers[2] + ": " + health[2], { font: "32px Arial", fill: "#000000" });
        this.kingdom_names[3].anchor = new Phaser.Point(0.5, 0.5);
        this.kingdom_names[3].rotation = -Math.PI/2;

        // Who Sumbitted Messages
        this.submit_messages[0] = this.add.text(130, 300, "Submitted", { font: "32px Arial", fill: "#FFFFFF" });
        this.submit_messages[0].anchor = new Phaser.Point(0.5, 0.5);
        this.submit_messages[0].rotation = Math.PI/2;
        this.submit_messages[0].visible = false;

        this.submit_messages[1] = this.add.text(400, 140, "Submitted", { font: "32px Arial", fill: "#FFFFFF" });
        this.submit_messages[1].anchor = new Phaser.Point(0.5, 0.5);
        this.submit_messages[1].visible = false;

        this.submit_messages[2] = this.add.text(670, 300, "Submitted", { font: "32px Arial", fill: "#FFFFFF" });
        this.submit_messages[2].anchor = new Phaser.Point(0.5, 0.5);
        this.submit_messages[2].rotation = -Math.PI/2;
        this.submit_messages[2].visible = false;

        // Start Timer
        socket.emit('startGameTimer', GAME_TIME);

        // Display Timer
        this.timer_text = this.add.text(20,20, gametimer, {font: "32px Arial", fill: "#FFFFFF" });
    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

        // RECORD PHASE
        if (record && (record_counter > 0))
        {
            // Set Counter Text to Record Counter
            this.timer_text.setText(record_counter);

            // Remove Who Submitted Messages
            for (var i = 0; i < 3; i++)
            {
                whoSubmitted[i] = false;
                this.submit_messages[i].visible = false;
            }

            // i represents other user "global" position
            for (var i = 0; i < 3; i++)
            {
                // j is the index for the other persons actions
                for (var j = 0; j < 6; j++)
                {
                    // If j is odd refers to defence
                    if (j%2)
                    {
                        if (record_actions[i][j])
                        {
                            this.defend_sprites[this.decode(record_actions["position"], i, j)].visible = true;
                        }
                    }
                    // If j is even refers to attack
                    else
                    {
                        if (record_actions[i][j])
                        {
                            this.attack_sprites[this.decode(record_actions["position"], i, j)].visible = true;
                        }
                    }
                }
            }

            // Update Health on Screen
            this.kingdom_names[0].setText(self + ": " + health["self"]);
            this.kingdom_names[1].setText(otherusers[0] + ": " + health[0]);
            this.kingdom_names[2].setText(otherusers[1] + ": " + health[1]);
            this.kingdom_names[3].setText(otherusers[2] + ": " + health[2]);

        }
        // BETWEEN RECORD PHASE AND NEXT GAME PHASE
        else if (record_counter <= 0)
        {
            // Stop displaying results
            for (var k = 0; k < 9; k++)
            {
                this.defend_sprites[k].visible = false;
                this.attack_sprites[k].visible = false;
            }

            // Remove all colorings from your buttons
            for (var k = 0; k < 3; k++)
            {
                this.attack_booleans[k] = false;
                this.attack_buttons[k].tint = 0x794044;
                this.defend_booleans[k] = false;
                this.defend_buttons[k].tint = 0x794044;
            }

            // Reset record counter and game counters
            // Show game counters
            record_counter = RESULTS_TIME;
            record = false;
            gametimer = GAME_TIME;
            this.timer_text.setText(gametimer);

            // If you win, you win
            if ((health[0] <= 0) && (health[1] <= 0) && (health[2] <= 0) && (health["self"] > 0))
            {
                this.win_text = this.add.text(400, 270, "You Win!", {font: "32px Arial", fill: "#FFFFFF" });
                this.win_text.anchor = new Phaser.Point(0.5, 0.5);
                this.backButton = this.add.button(30,500,'backButton', this.backMainMenu,this);
            }
            // If you are alive, set the submit boolean to false so you can submit your moves 
            // for the next turn
            else if (health["self"] > 0)
            {
                this.submit_boolean = false;
                this.submit_button.visible = true;
            }
            // If you are dead, you lose and you always submit nothing at the beginning of the 
            else
            {
                this.submit_button = false;
                //this.submit();
                health["self"] = 0;
                this.lose_text = this.add.text(400, 270, "You Lose!", {font: "32px Arial", fill: "#FFFFFF" });
                this.lose_text = new Phaser.Point(0.5,0.5);
                this.backButton = this.add.button(30,500,'backButton', this.backMainMenu ,this);
            }


            if (health[0] <= 0)
                health[0] = 0;
            if (health[1] <= 0)
                health[1] = 0;
            if (health[2] <= 0)
                health[2] = 0;
            
            // Update Health on Screen
            this.kingdom_names[0].setText(self + ": " + health["self"]);
            this.kingdom_names[1].setText(otherusers[0] + ": " + health[0]);
            this.kingdom_names[2].setText(otherusers[1] + ": " + health[1]);
            this.kingdom_names[3].setText(otherusers[2] + ": " + health[2]);

            if ((health[0] <= 0) && (health[1] <= 0) && (health[2] <= 0))
            {
                socket.emit("gameEnd", false);
            }


        }
        // GAME PHASE
        else
        {
            this.timer_text.setText(gametimer);

            if (gametimer <= 0)
            {
                this.submit();
            }

            for (var i = 0; i < 3; i++)
            {
                if (whoSubmitted[i])
                {
                    this.submit_messages[i].visible = true;
                }
            }

        }

        // ALL THROUGHOUT THE GAME

        //console.log(otherPlayerDisconnect);
        for (var i = 0; i < 3; i++)
        {
            if (otherPlayerDisconnect[i])
            {
                this.kingdom_names[i + 1].setText("Disconnected");
                this.kingdom[i + 1].tint = 0x794044;
            }
        }

    },

    backMainMenu: function(){
        disconnect = false;
        backToMainMenu();
    },

    attack0: function () {

        if (!this.submit_boolean) {
            if (this.attack_booleans[0])
            {
                this.attack_buttons[0].tint = 0x794044;
                this.attack_booleans[0] = false;
            }
            else
            {
                this.attack_buttons[0].tint = 0xFFFFFF;
                this.attack_booleans[0] = true;
            }
        } 

    },

    attack1: function () {

        if (!this.submit_boolean) {
            if (this.attack_booleans[1])
            {
                this.attack_buttons[1].tint = 0x794044;
                this.attack_booleans[1] = false;
            }
            else
            {
                this.attack_buttons[1].tint = 0xFFFFFF;
                this.attack_booleans[1] = true;
            }
        } 

    },

    attack2: function () {

        if (!this.submit_boolean) {
            if (this.attack_booleans[2])
            {
                this.attack_buttons[2].tint = 0x794044;
                this.attack_booleans[2] = false;
            }
            else
            {
                this.attack_buttons[2].tint = 0xFFFFFF;
                this.attack_booleans[2] = true;
            }
        } 

    },

    defend0: function () {

        if (!this.submit_boolean) {
            if (this.defend_booleans[0])
            {
                this.defend_buttons[0].tint = 0x794044;
                this.defend_booleans[0] = false;
            }
            else
            {
                this.defend_buttons[0].tint = 0xFFFFFF;
                this.defend_booleans[0] = true;
            }
        } 
    },

    defend1: function () {

        if (!this.submit_boolean) {
            if (this.defend_booleans[1])
            {
                this.defend_buttons[1].tint = 0x794044;
                this.defend_booleans[1] = false;
            }
            else
            {
                this.defend_buttons[1].tint = 0xFFFFFF;
                this.defend_booleans[1] = true;
            }
        } 

    },

    defend2: function () {

        if (!this.submit_boolean) {
            if (this.defend_booleans[2])
            {
                this.defend_buttons[2].tint = 0x794044;
                this.defend_booleans[2] = false;
            }
            else
            {
                this.defend_buttons[2].tint = 0xFFFFFF;
                this.defend_booleans[2] = true;
            }
        } 


    },

    select_down: function () {
        if (this.keycontrlgame) { 
            if (this.select_what == -1)
            {
                this.select_what = 0;
                this.select[this.select_what].visible = true;
            }
            else if ((this.select_what == 0) || (this.select_what == 2) || (this.select_what == 4))
            {
                this.select[this.select_what++].visible = false;
                this.select[this.select_what].visible = true;
            }
        }
     },
    select_up: function() {
        if (this.keycontrlgame) { 
            if (this.select_what == -1)
            {
                this.select_what = 0;
                this.select[this.select_what].visible = true;
            }
            else if ((this.select_what == 1) || (this.select_what == 3) || (this.select_what == 5))
            {
                this.select[this.select_what--].visible = false;
                this.select[this.select_what].visible = true;
            }
        }
     },
    select_right: function() {
        if (this.keycontrlgame) { 
            if (this.select_what == -1)
            {
                this.select_what = 0;
                this.select[this.select_what].visible = true;
            }
            else if ((this.select_what == 0) || (this.select_what == 1) || (this.select_what == 2) || (this.select_what == 3))
            {
                this.select[this.select_what].visible = false;
                this.select_what += 2;
                this.select[this.select_what].visible = true;
            }
        }
     },
    select_left: function () {
        if (this.keycontrlgame) { 
            if (this.select_what == -1)
            {
                this.select_what = 0;
                this.select[this.select_what].visible = true;
            }
            else if ((this.select_what == 4) || (this.select_what == 5) || (this.select_what == 2) || (this.select_what == 3))
            {
                this.select[this.select_what].visible = false;
                this.select_what -= 2;
                this.select[this.select_what].visible = true;
            }
        }
     },
    select: function () {
        if (this.keycontrlgame) {    
            if (this.select_what == -1 || this.select_what > 5)
            {
                this.select_what = 0;
                this.select[this.select_what].visible = true;
            }
            else if (this.select_what == 0)
            {
                this.attack0();
            }
            else if (this.select_what == 1)
            {
                this.defend0();
            }
            else if (this.select_what == 2)
            {
                this.attack1();
            }
            else if (this.select_what == 3)
            {
                this.defend1();
            }
            else if (this.select_what == 4)
            {
                this.attack2();
            }
            else if (this.select_what == 5)
            {
                this.defend2();
            }
        }
    },

    enter_selection: function () {
        if (this.keycontrlgame)
        {
            this.submit();
        }
    },

    submit: function () {

        this.submit_button.visible = false;
        if (!this.submit_boolean || (health["self"] == 0))
        {

            var actions = { 'id' : socket.id,
                        0: this.attack_booleans[0], 
                        1: this.defend_booleans[0], 
                        2: this.attack_booleans[1], 
                        3: this.defend_booleans[1], 
                        4: this.attack_booleans[2],
                        5: this.defend_booleans[2] };
            socket.emit('actions', actions);
        }

        this.submit_boolean = true;

    },

    decode: function (yourPos, otherplayerPos, direction) 
    {
        if (yourPos == 0)
        {
            if (otherplayerPos == 0)
            {
                if ((direction == 0) || (direction == 1)) { return 2; }
                else if ((direction == 2) || (direction == 3)) { return 1; }
                else if ((direction == 4) || (direction == 5)) { return 0; }
            }
            else if (otherplayerPos == 1)
            {
                if ((direction == 0) || (direction == 1)) { return 3; }
                else if ((direction == 2) || (direction == 3)) { return 5; }
                else if ((direction == 4) || (direction == 5)) { return 4; }
            }
            else if (otherplayerPos == 2)
            {
                if ((direction == 0) || (direction == 1)) { return 7; }
                else if ((direction == 2) || (direction == 3)) { return 6; }
                else if ((direction == 4) || (direction == 5)) { return 8; }
            }
        }
        else if (yourPos == 1)
        {
            if (otherplayerPos == 0)
            {
                if ((direction == 0) || (direction == 1)) { return 2; }
                else if ((direction == 2) || (direction == 3)) { return 1; }
                else if ((direction == 4) || (direction == 5)) { return 0; }
            }
            else if (otherplayerPos == 1)
            {
                if ((direction == 0) || (direction == 1)) { return 5; }
                else if ((direction == 2) || (direction == 3)) { return 3; }
                else if ((direction == 4) || (direction == 5)) { return 4; }
            }
            else if (otherplayerPos == 2)
            {
                if ((direction == 0) || (direction == 1)) { return 6; }
                else if ((direction == 2) || (direction == 3)) { return 7; }
                else if ((direction == 4) || (direction == 5)) { return 8; }
            }
        }
        else if (yourPos == 2)
        {
            if (otherplayerPos == 0)
            {
                if ((direction == 0) || (direction == 1)) { return 1; }
                else if ((direction == 2) || (direction == 3)) { return 2; }
                else if ((direction == 4) || (direction == 5)) { return 0; }
            }
            else if (otherplayerPos == 1)
            {
                if ((direction == 0) || (direction == 1)) { return 5; }
                else if ((direction == 2) || (direction == 3)) { return 3; }
                else if ((direction == 4) || (direction == 5)) { return 4; }
            }
            else if (otherplayerPos == 2)
            {
                if ((direction == 0) || (direction == 1)) { return 6; }
                else if ((direction == 2) || (direction == 3)) { return 8; }
                else if ((direction == 4) || (direction == 5)) { return 7; }
            }
        }
        else if (yourPos == 3)
        {
            if (otherplayerPos == 0)
            {
                if ((direction == 0) || (direction == 1)) { return 1; }
                else if ((direction == 2) || (direction == 3)) { return 0; }
                else if ((direction == 4) || (direction == 5)) { return 2; }
            }
            else if (otherplayerPos == 1)
            {
                if ((direction == 0) || (direction == 1)) { return 5; }
                else if ((direction == 2) || (direction == 3)) { return 4; }
                else if ((direction == 4) || (direction == 5)) { return 3; }
            }
            else if (otherplayerPos == 2)
            {
                if ((direction == 0) || (direction == 1)) { return 6; }
                else if ((direction == 2) || (direction == 3)) { return 8; }
                else if ((direction == 4) || (direction == 5)) { return 7; }
            }
        }
    },

    toggleGC: function () { 

        if (this.keycontrlgame)
        {
            this.keycontrlgame = false;
            $("#messageInput").focus();
            game.input.keyboard.removeKey(Phaser.keyboard.SHIFT);
            game.input.keyboard.removeKey(Phaser.keyboard.ENTER);
            game.input.keyboard.removeKey(Phaser.keyboard.UP);
            game.input.keyboard.removeKey(Phaser.keyboard.DOWN);
            game.input.keyboard.removeKey(Phaser.keyboard.LEFT);
            game.input.keyboard.removeKey(Phaser.keyboard.RIGHT);
        }
        else
        {
            this.keycontrlgame = true;

            this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.upKey.onDown.add(BasicGame.Game.prototype.select_up, this);

            this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            this.downKey.onDown.add(BasicGame.Game.prototype.select_down, this);

            this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.leftKey.onDown.add(BasicGame.Game.prototype.select_left, this);

            this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.rightKey.onDown.add(BasicGame.Game.prototype.select_right, this);

            this.shiftkey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.shiftkey.onDown.add(BasicGame.Game.prototype.select, this);

            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enterKey.onDown.add(BasicGame.Game.prototype.enter_selection, this);
        }
    }

};
