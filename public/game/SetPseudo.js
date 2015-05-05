BasicGame.SetPseudo = function (game) {
	
	this.pseudoBackground = null;
	this.timer_text = null;
	this.warningMessage = null;
}

var pseudoTimer = PSEUDO_TIME;

socket.on('pseudoTimer',function(time){
	pseudoTimer = time;
});

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

		$(".pseudo").show();

	},

	update: function () {
		
        this.timer_text.setText(pseudoTimer);
        if (pseudoTimer <= 0)
        {
        	this.timer_text.visible = false;
        	$("#pseudoInput").val(defaultName);
        	setPseudo();
        }
	}

};
