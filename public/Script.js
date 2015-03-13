var socket = io.connect();

var self;
var allusers = [];

// Add a message and a pseudo
function addMessage(msg, pseudo) {
    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

// Sending a message
function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        var recipient = self;
        for (var i = 0; i < allusers.length; i++)
        {
            if (document.getElementById(allusers[i]).checked)
            {
                recipient = allusers[i]
            }
        }

        if (recipient != self)
        {
            var messagerecip = [$('#messageInput').val(), recipient]
            //socket.emit('recipient', document.getElementById("recipient").value);
            //console.log(document.getElementById("recipient").value);
            socket.emit('message', messagerecip);
            addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
            $('#messageInput').val('');
        }
    }
}

// Setting a pseudo
function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        self = $("#pseudoInput").val();
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}

socket.on('setPseudo', function(data) {
    allusers.push(data);
    $("#otheruser").append('<div><input type="radio" id="'+ data + '" name="recipient" value="'+ data +'">' + data + '</div>');
});

socket.on('message', function(data) {
    if (data['recipient'] == self) 
    {
        addMessage(data['message'], data['pseudo']);
    }
});

$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#submit").click(function() {sentMessage();});
});
