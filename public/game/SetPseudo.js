BasicGame.SetPseudo = function (game) {
	
	this.pseudoBackground = null;
	this.timer_text = null;
	this.warningMessage = null;
	this.nameTakenMessage = null;
	this.nameTooLongMessage = null;
	this.nameReservedMessage = null;
}

var pseudoTimer = PSEUDO_TIME;
var nameTaken = false;
var nameTooLong = false;
var reservedName = false;

socket.on('pseudoTimer',function(time){
	pseudoTimer = time;
});

socket.on('pseudoError',function(errorName){
	if (errorName == "noError"){
		$('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
        game.state.start('WaitingRoom2');
        $("#pseudoInput").val("");
	}
	else if(errorName == "tooLong"){
		nameTaken = false;
		nameTooLong = true;
		reservedName = false;
		$("#pseudoInput").val("");
	}
	else if (errorName == "nameTaken"){
		nameTaken = true;
		nameTooLong = false;
		reservedName = false;
		$("#pseudoInput").val("");
	}
	else if (errorName == "reservedName"){
		nameTaken = false;
		nameTooLong = false;
		reservedName = true;
		$("#pseudoInput").val("");
	}
})

BasicGame.SetPseudo.prototype = {

	preload: function () {
		this.pseudoBackground = this.add.sprite(0,0,'gameBackground');
        this.pseudoBackground.width = 800;
        this.pseudoBackground.height = 600;
	},

	create: function () {

		socket.emit('startPseudoTimer',PSEUDO_TIME);

		// Display timer
		this.timer_text = this.add.text(20,20, pseudoTimer, {font: "32px Arial", fill: "#FFFFFF" });

		// Display warning message
		this.warningMessage = this.add.text(400,50, "Do Not Close Your Browser", {font: "32px Arial", fill: "#FFFFFF" });
		this.warningMessage.anchor = new Phaser.Point(0.5, 0.5);
		this.warningMessage.visible = false;

		// Display name taken message
		this.nameTakenMessage = this.add.text(400,50, "Name is taken! Try another.", {font: "32px Arial", fill: "#FFFFFF" });
		this.nameTakenMessage.anchor = new Phaser.Point(0.5, 0.5);
		this.nameTakenMessage.visible = false;

		// Display name too long message
		this.nameTooLongMessage = this.add.text(400,50, "Name is too long!\n Try another with less than 10 characters.", {font: "32px Arial", fill: "#FFFFFF", align: "center" });
		this.nameTooLongMessage.anchor = new Phaser.Point(0.5, 0.5);
		this.nameTooLongMessage.visible = false;

		// Display name reserved message
		this.nameReservedMessage = this.add.text(400,50, "Name is reserved! Try another.", {font: "32px Arial", fill: "#FFFFFF" });
		this.nameReservedMessage.anchor = new Phaser.Point(0.5, 0.5);
		this.nameReservedMessage.visible = false;

		$(".pseudo").show();

	},

	update: function () {
		if (nameTaken){
			this.nameTakenMessage.visible = true;
		}
		else{
			this.nameTakenMessage.visible = false;
		}
		if (nameTooLong){
			this.nameTooLongMessage.visible = true;
		}
		else{
			this.nameTooLongMessage.visible = false;
		}
		if (reservedName){
			this.nameReservedMessage.visible = true;
		}
		else{
			this.nameReservedMessage.visible = false;
		}
        this.timer_text.setText(pseudoTimer);
        if (pseudoTimer <= 0)
        {
        	this.timer_text.visible = false;
        	$("#pseudoInput").val(defaultName);
        	setPseudo(true);
        }
	}

};
