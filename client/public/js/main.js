const socket = io()

const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const msg_box = $("#msg-box")
msg_box.prop('scrollHeight')

//join chat-room
socket.emit('join-room',{username, room})

//test msg
socket.on("message", message => {
    $(document).ready(function() {
        $("#msg-box").append(`<p class="meta">${message.username}<span>${message.time}</span></p>
                              <p class="text">${message.text}</p>`)
    })
})

//server sends chat to client
$(document).ready(function() {
    socket.on('chat-msg' ,msg => {
        $("#msg-box").append(`<p class="meta">${msg.username}<span>${msg.time}</span></p>
                              <p class="text">${msg.text}</p>`)
    })
})

socket.emit("check_turn")

socket.on("roomUsers",data => {
    outputroom(data.room)
    outputuser(data.users)
})

socket.on("game-start",(log) => {
    $("#ready").hide()
    $("#wrapper").show()
    console.log(log)
})

var turn
var symbol
socket.on("GS", clientturn => {
    turn = clientturn.turn
    symbol = clientturn.symbol
    $(document).ready(function(){
        $(".oxo").one('click',(function(){
            let oxo = $(this).attr('id')
            if(turn == true) {
                checkwinner(oxo,clientturn,symbol)
                socket.emit("box-clicked",{oxo,symbol})
                turn = false
            } 
        }))
    })
})

socket.on('test', boxinfo => {
    thissymbol(boxinfo.oxo,boxinfo.symbol)
})

function thissymbol(id,thissymbol) {
    $(`#${id}`).toggleClass(thissymbol)
}

$(document).ready(function(){
    $("#wrapper").hide()
    $("#ready").click(function() {
        socket.emit("ready",{username,room})
        $(this).hide()
    })
    //get input value each time form submited
    $("#message-form").submit((e) =>{
        const msg = $("#usermsg").val()
        e.preventDefault()
        socket.emit("client-msg",msg)
        //clear input field
        $("#usermsg").val("")
    })
})


function outputroom(room) {
    $("#room-name").text(room)
}

function outputuser(users) {
    $("#list-player").empty()
    users.forEach(element => {
        $("#list-player").append(`<li>${element.username}</li>`)
    });
}

$(document).ready(function() {
    socket.on("box-clicked-to-client",element_id => {
        $(`#${element_id}`).toggleClass('X')
    })
})

var allmove = []
function checkwinner(id,client, symbol) {
    let element_id = $(`#${id}`).attr('id')
    allmove.push({element_id,symbol})
    try {
        if(allmove[0].symbol == allmove[1].symbol && allmove[0].symbol == allmove[2].symbol){
            socket.emit("end-game")
        }
    } catch {
       return null 
    }
}

socket.on("winner", mess => {
    alert(mess)
})

socket.on('loser', mess => {
    alert(mess)
})