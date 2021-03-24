//const nssocket = require('nssocket')
const dgramx = require('dgramx')
const  { Socket } = require('net-socket.io')
const socket = Socket(3000,'localhost')
var dgram_client = dgramx.createClient('udp://localhost:3000')
const prompt = require('electron-prompt')

prompt({
    title:"User name",
    label: 'User name',
    value: '',
    inputAttrs: { // attrs to be set if using 'input'
    type: 'string'
  },
}).then((r) => {
  if(r === null) {
      console.log('user cancelled');
  } else {
    let username = r
    prompt({
      title:"Room",
      label:"Room",
      type: 'select', // 'select' or 'input, defaults to 'input'
    selectOptions: { // select options if using 'select' type
        'Room 1': 'Room 1',
        'Room 2': 'Room 2',
        'Room 3': 'Room 3'
    }
    }).then((r) => {
      if(r === null) {
        console.log('user cancelled')
      } else {
        let room = r
        socket.emit('tcp_user_info',{username,room})
      }
    })
  }
})
.catch(console.error);

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    const $ = require('jquery')
      /*
      $("#form").submit(function(e) {
        //e.preventDefault()
        let username = $("#username").val()
        let room = $("#room").val()
        dgram_client.emit('user_info',{username,room})
        //socket.emit('tcp_user_info',{username,room})
      })
      */
     socket.on("room-ready",([turn,symbol]) => {
       console.log('game is ready')
      $(".oxo").one('click',function() {
        if(turn == true) {
          socket.emit('btn-click',[$(this).attr('id'),symbol])
          turn = false
        } else {
          console.log("you cant")
        }
      })
     })
  
      $("#message-form").submit(function(e) {
        e.preventDefault()
        let input = $("#usermsg").val()
        socket.emit("msg",input)
        $("#usermsg").val("")
      })
      
      socket.on("user-msg",([id,symbol]) => {
          if(symbol == "X") {
            $(`#${id}`).toggleClass("X")
          } else {
            $(`#${id}`).toggleClass("O")
          }
        })

        socket.on("chat-msg",([username,msg]) => {
          $("#msg-box").append(`<div>${username}: ${msg}</div>`)
        })
  }
}
