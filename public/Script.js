var socket = io.connect("http://liargame-akgr.rhcloud.com:8000");
//var socket = io.connect();

var self = null;
var otherusers = [];
var num_messages = 0;
var defaultName;

// Related to Game
var whoSubmitted = [false, false, false];
var otherPlayerDisconnect = [false, false, false];

// Constant Values - MUST MATCH THE SAME NAME ON SERVER FILE
var GAME_TIME = 150;
var RESULTS_TIME = 15;
var MAX_HEALTH = 20;
var PSEUDO_TIME = 30;

// Add a message and a pseudo
function addMessage(msg, pseudo) {
    num_messages++;
    $("#chatEntries").append('<div class="' + num_messages +'" ><p>' + pseudo + ' : ' + msg + '</p></div>');
    $("#chatEntries").scrollTop(document.getElementById("chatEntries").scrollHeight);
}

// Sending a message
function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        var recipient = self;
        for (var i = 0; i < otherusers.length; i++)
        {
            console.log(otherusers[i]);
            if (document.getElementById(otherusers[i]).checked)
            {
                recipient = otherusers[i];
            }
        }

        if (recipient != self)
        {
            var messagerecip = [$('#messageInput').val(), recipient]
            socket.emit('message', messagerecip);
            addMessage($('#messageInput').val(), self + " to " + recipient, new Date().toISOString(), true);
            $('#messageInput').val('');
            
        }
    }
}

// Setting a pseudo
function setPseudo(isDefault) {
    isDefault = typeof isDefault !== 'undefined' ? isDefault : false;
    if ($("#pseudoInput").val() != "")
    {
        whoSubmitted = [false, false, false];
        otherPlayerDisconnect = [false, false, false];
        self = $("#pseudoInput").val();
        var data = {'pseudo' : self, 'default' : isDefault};
        socket.emit('setPseudo', data);
    }
}

//Hosting a room
function hostRoom(){
    if ($("#hostRoomInput").val() != ""){
        socket.emit('host', $("#hostRoomInput").val());
        $('#hostRoomInput').val('');
        $('#hostRoomInput').hide();
        $('#hostRoom').hide();
    }
}

//Joining a room
function joinRoom(){
    if ($("#joinRoomInput").val() != ""){
        socket.emit('join', $("#joinRoomInput").val());
        $('#joinRoomInput').hide();
        $('#joinRoom').hide();
    }
}

function backToMainMenu() {

    // Hide the pseudos
    $(".pseudo").hide();
    // Clear radio buttons, chat entries and otheruser values
    $("#otheruser").empty();
    $("#chatEntries").empty();
    otherusers = [];
    // Just in case
    num_messages = 0;

    game.state.start('MainMenu');
}

socket.on('roomApproved',function(data){
    if (data['approved'] == true){
        game.state.start("WaitingRoom", false, false, data['name']);
        defaultName = "player-" + data['position'];
    }
    else
        game.state.start("MainMenu");
})

//socket.on('gameStart', function(data){
//    game.state.start("SetPseudo");
//});

socket.on('setPseudo', function(data) {
    
    for (var i = 0; i < data.length; i++)
    {
        if (data[i] != self)
        {
            otherusers.push(data[i]);
            $("#otheruser").append('<div><input type="radio" class="ChatRadio" id="'+ data[i] + '" name="recipient" value="'+ data[i] +'">' + data[i] + '</div>');    
        }
    }
    document.getElementById(otherusers[0]).checked = true;

});

socket.on('message', function(data) {
    if (data['recipient'] == self) 
    {
        addMessage(data['message'], data['pseudo']);
    }
});

socket.on('backToMainMenu', function () {
    // If this is called we are in SetPseudo or WaitingRoom2 stages

    // For the main menu
    disconnect = true;

    backToMainMenu();
});

function onStart() {
    $("#chatControls").hide();
    $(".pseudo").hide();
    $(".hRoom").hide();
    $(".jRoom").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#pseudoInput").keyup(function(e) { 
        if(e.keyCode == 13)
            setPseudo()});
    $("#hostRoom").click(function() {hostRoom()});
    $("#hostRoomInput").keyup(function(e) { 
        if(e.keyCode == 13)
            hostRoom()});
    $("#joinRoom").click(function() {joinRoom()});
    $("#joinRoomInput").keyup(function(e) { 
        if(e.keyCode == 13)
            joinRoom()});
    $("#submit").click(function() {sentMessage()});
    $("#messageInput").keyup(function(e) {
        if(e.keyCode == 13 && !(keycontrlgame))
        {
            sentMessage();
        }
        if ((e.keyCode == 40) && !(keycontrlgame))
        {
            if (document.getElementById(otherusers[0]).checked)
            {
                document.getElementById(otherusers[0]).checked = false;
                document.getElementById(otherusers[1]).checked = true;
            }
            else if (document.getElementById(otherusers[1]).checked)
            {
                document.getElementById(otherusers[1]).checked = false;
                document.getElementById(otherusers[2]).checked = true;
            }

        }
        if ((e.keyCode == 38) && !(keycontrlgame))
        {
            if (document.getElementById(otherusers[1]).checked)
            {
                document.getElementById(otherusers[1]).checked = false;
                document.getElementById(otherusers[0]).checked = true;
            }
            else if (document.getElementById(otherusers[2]).checked)
            {
                document.getElementById(otherusers[2]).checked = false;
                document.getElementById(otherusers[1]).checked = true;
            }
        }
    });

}

$(document).ready(onStart);
