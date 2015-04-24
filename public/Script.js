var socket = io.connect();

var self = null;
var otherusers = [];
var num_messages = 0;

// Constant Values - MUST MATCH THE SAME NAME ON SCRIPT FILE
var GAME_TIME = 150;
var RESULTS_TIME = 15;

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
function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        self = $("#pseudoInput").val();
        var data = {'pseudo' : self};
        socket.emit('setPseudo', data);
        
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
        game.state.start('WaitingRoom2');
        $("#pseudoInput").val("");
    }
}

//Hosting a room
function hostRoom(){
    if ($("#hostRoomInput").val() != ""){
        socket.emit('host', $("#hostRoomInput").val());
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

socket.on('roomApproved',function(data){
    if (data['approved'] == true){
        game.state.start("WaitingRoom", false, false, data['name']);
    }
    else
        game.state.start("MainMenu");
})

socket.on('gameStart', function(data){
    game.state.start("SetPseudo");
});

socket.on('setPseudo', function(data) {
    if (data['pseudo'] != self)
    {
        otherusers.push(data['pseudo']);
        $("#otheruser").append('<div><input type="radio" id="'+ data['pseudo'] + '" name="recipient" value="'+ data['pseudo'] +'">' + data['pseudo'] + '</div>');    
    }
});

socket.on('message', function(data) {
    if (data['recipient'] == self) 
    {
        addMessage(data['message'], data['pseudo']);
    }
});

function onStart() {
    $("#chatControls").hide();
    $(".pseudo").hide();
    $(".hRoom").hide();
    $(".jRoom").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#pseudoInput").keypress(function(e) { 
        if(e.which == 13)
            setPseudo()});
    $("#hostRoom").click(function() {hostRoom()});
    $("#hostRoomInput").keypress(function(e) { 
        if(e.which == 13)
            hostRoom()});
    $("#joinRoom").click(function() {joinRoom()});
    $("#joinRoomInput").keypress(function(e) { 
        if(e.which == 13)
            joinRoom()});
    $("#submit").click(function() {sentMessage()});
    $("#messageInput").keypress(function(e) {
        if(e.which == 13)
            sentMessage(); });

}

$(document).ready(onStart);
