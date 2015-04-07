var socket = io.connect();

var self = null;
var allusers = [];
var num_messages = 0;

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
        for (var i = 0; i < allusers.length; i++)
        {
            console.log(allusers[i]);
            if (document.getElementById(allusers[i]).checked)
            {
                recipient = allusers[i];
            }
        }

        if (recipient != self)
        {
            var messagerecip = [$('#messageInput').val(), recipient]
            //socket.emit('recipient', document.getElementById("recipient").value);
            //console.log(document.getElementById("recipient").value);
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
        game.state.start('Game');
        $("#pseudoInput").val("");
    }
}

function hostRoom(){
    if ($("#hostRoomInput").val() != ""){
        socket.emit('host', $("#hostRoomInput").val());
        $('#hostRoomInput').hide();
        $('#hostRoom').hide();
        game.state.start("WaitingRoom");
    }
}

function joinRoom(){
    if ($("#joinRoomInput").val() != ""){
        socket.emit('join', $("#joinRoomInput").val());
        $('#joinRoomInput').hide();
        $('#joinRoom').hide();
        game.state.start("WaitingRoom");
    }
}

socket.on('gameStart', function(data){
    game.state.start("SetPseudo");
});

socket.on('setPseudo', function(data) {
    allusers.push(data['pseudo']);
    $("#otheruser").append('<div><input type="radio" id="'+ data['pseudo'] + '" name="recipient" value="'+ data['pseudo'] +'">' + data['pseudo'] + '</div>');    
});

socket.on('message', function(data) {
    if (data['recipient'] == self) 
    {
        addMessage(data['message'], data['pseudo']);
    }
});

socket.on('time', function(data) {
    //console.log(data['timer']);
    var seconds = data['timer'] % 60;
    var minutes = Math.floor(data['timer'] / 60);
    var output = (seconds < 10)? (minutes + ":0" + seconds) : (minutes + ":" + seconds);
    $("#timer").empty().append(output);
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
