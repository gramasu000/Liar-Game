BasicGame.JoinRoom = function (game) {
	
	this.joinRoomBackground = null;
	this.backButton = null;
	this.roomButtons = [];
}

var numGamesPossible = 10;
var listOfGames = ['','','','','','','','','',''];
var numPlayerInGame = {};

socket.on('createRoomButton',function(name){
	for (var i = 0; i < listOfGames.length; i++) {
		if (listOfGames[i] == ''){
			listOfGames[i] = name;
			numPlayerInGame[name] = 1;
			break;
		}
	}
});

socket.on('initializeRoomButtons',function(rooms){
	var roomList = Object.keys(rooms);
	for (var i = 0; i < roomList.length; i++) {
		var name = roomList[i];
		listOfGames[i] = name;
		numPlayerInGame[name] = rooms[name];
	};
});

socket.on('updateRoomButtons',function(data){
	if (data['increase'] == true){
		numPlayerInGame[data['name']]++;
	}
	else if (data['increase'] == false){
		numPlayerInGame[data['name']]--;
	}
});

socket.on('deleteRoomButton',function(name){
	for (var i = 0; i < numGamesPossible; i++) {
		if (listOfGames[i] == name){
			listOfGames[i] = '';
			delete numPlayerInGame[name];
			break;
		}
	}
	for (var i = 1; i < numGamesPossible; i++) {
		if (listOfGames[i] != ''){
			var j;
			for (j = i-1; j >= 0 && listOfGames[j] == ''; j--);
			listOfGames[j+1] = listOfGames[i];
			listOfGames[i] = '';
		}
	};
});

var RoomButton = function(game, x, y, key, name, callback, callbackContext)
{
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext);
    this.style = {
        'font': '30px Arial',
        'fill': 'black'
    };
    this.anchor.setTo( 0 , 0);

    this.actualName = name;
    this.roomName = new Phaser.Text(game, 0, 0, 'Room Name: ' + name, this.style);
    this.numPlayer = new Phaser.Text(game, 0, 0, 'Number of Players: 0/4', this.style);

    //puts the label in the center of the button
    this.roomName.anchor.setTo( -0.075 , 0 );
    this.numPlayer.anchor.setTo( -0.05, -0.9 );
    
    this.addChild(this.roomName);
    this.addChild(this.numPlayer);
    this.setRoomName(name);

    game.add.existing(this);
};
 
RoomButton.prototype = Object.create(Phaser.Button.prototype);
RoomButton.prototype.constructor = RoomButton;
RoomButton.prototype.setRoomName = function( name ) {

	this.actualName = name;
	this.roomName.setText('Room Name: ' + name);
 
};
RoomButton.prototype.setPlayerNumber = function( num ) {

	this.numPlayer.setText("Number of Players: " + num + "/4"); 

};

BasicGame.JoinRoom.prototype = {

	preload: function () {
		this.roomButtons = [];

		this.joinRoomBackground = this.add.sprite(0,0,'gameBackground');
        this.joinRoomBackground.width = 800;
        this.joinRoomBackground.height = 600;

        this.backButton = this.add.button(30,500,'backButton',this.backToMainMenu,this);
      
        for (var i = 20; i <= 380; i += 90) {
        	this.roomButtons.push(new RoomButton(this,10,i,'roomButton',''));
        	this.roomButtons.push(new RoomButton(this,405,i,'roomButton',''));
        }
        for (var i = 0; i < this.roomButtons.length; i++) {
        	this.roomButtons[i].events.onInputDown.add(this.joinGameRoom,this);
        	this.roomButtons[i].visible = false;
        }
	},

	create: function () {

		$(".jRoom").show();

	},

	update: function () {
		console.log(listOfGames);
		for (var i = 0; i < numGamesPossible; i++) {
			if (listOfGames[i] != ''){
				this.roomButtons[i].setRoomName(listOfGames[i]);
				this.roomButtons[i].setPlayerNumber(numPlayerInGame[listOfGames[i]]);
				this.roomButtons[i].visible = true;
			}
			else
				this.roomButtons[i].visible = false;
		}
	},

	joinGameRoom: function (button){
		socket.emit('join',button.actualName);
		$('#joinRoomInput').hide();
        $('#joinRoom').hide();
	},

	backToMainMenu: function(){
		$('#joinRoomInput').hide();
        $('#joinRoom').hide();
		this.state.start('MainMenu');
	}
};
