BasicGame.SetPseudo = function (game) {
	
	this.pseudoBackground = null;
}

BasicGame.SetPseudo.prototype = {

	preload: function () {
		this.pseudoBackground = this.add.sprite(0,0,'gameBackground');
        this.pseudoBackground.width = 800;
        this.pseudoBackground.height = 600;
	},

	create: function () {

		$(".pseudo").show();

	},

	update: function () {

	}

};
