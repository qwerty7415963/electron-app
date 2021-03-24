
const dgramx = require('dgramx')
const  { Server } = require('net-socket.io')
const net_server = Server(3000);
const { userJoin_client,users_client,userLeaveroom_client,getCurrentUser_client,getAlluserInroom_client } = require('./client/utils/client_user');
const formatMessage_client = require('./client/utils/messages_client');
//var nssoket = require('nssocket')



////////////////////////////////////////////////////////////////////////////////////////////////////////////
net_server.on('connection',(socket) => {
  //console.log(socket.netSocket)
  //let rmtaddress = socket.netSocket.remoteAddress
  console.log(`TCP server listenning on ${socket.netSocket.localAddress}:${socket.netSocket.localPort}`)
  socket.on('tcp_user_info',(data) => {
    const user = userJoin_client(socket.netSocket.remoteAddress,data.username,data.room,socket)

    //add new client info
    let tbody_child = document.getElementById('table-body').childNodes
    tbody_child.forEach(element => {
      element.remove()
    })
    users_client.forEach(element => {
      let tr = document.createElement('tr')
      let td1 = document.createElement('td')
      let td2 = document.createElement('td')
      let td3 = document.createElement('td')
      td1.innerHTML = `${element.socket_address}`
      td2.innerHTML = `${element.username}`
      td3.innerHTML = `${element.room}`
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      document.getElementById('table-body').appendChild(tr)
    })
    users_client.forEach((user,index) => {
      if(index%2 == 0) {
        user['turn'] = true
        user['symbol'] = "X"
      }
      if(index%2 == 1) {
        user['turn'] = false
        user['symbol'] = "Y"
      }
    })
    const all = getAlluserInroom_client(user.room)
    if(all.length >= 2) {
      all.forEach(sock => {
        sock.Socket.emit("room-ready",[sock.turn,sock.symbol])
      })
    }
  })

  socket.on('btn-click',([id,symbol]) => {
    const user = getCurrentUser_client(socket.netSocket.remoteAddress)
    const all = getAlluserInroom_client(user.room)
    console.log(`${user.username} clicked`)
    all.forEach(sock =>{
      sock.Socket.emit('user-msg',[id, symbol])
    })
    all.forEach(sock => {
      if(sock.turn == true) {
        sock.turn = false
      } else {
        sock.turn = true
      }
      sock.Socket.emit("room-ready",([sock.turn,sock.symbol]))
    })
  })
  socket.on('msg',msg => {
    const user = getCurrentUser_client(socket.netSocket.remoteAddress)
    const all = getAlluserInroom_client(user.room)
    all.forEach(sock => {
      sock.Socket.emit("chat-msg",[user.username,msg])
    })
  })




/*
  socket.on('error',(err) => {
    const user = userLeaveroom_client(socket.netSocket.remoteAddress)
    delete user
        //add new client info
        let tbody_child = document.getElementById('table-body').childNodes
        tbody_child.forEach(element => {
          element.remove()
        })
        users_client.forEach(element => {
          let tr = document.createElement('tr')
          let td1 = document.createElement('td')
          let td2 = document.createElement('td')
          let td3 = document.createElement('td')
          td1.innerHTML = `${element.socket_address}`
          td2.innerHTML = `${element.username}`
          td3.innerHTML = `${element.room}`
          tr.appendChild(td1)
          tr.appendChild(td2)
          tr.appendChild(td3)
          document.getElementById('table-body').appendChild(tr)
        })
  })
  */
  

  socket.on('close',() => {
    console.log("client closed")
    const user = userLeaveroom_client(socket.netSocket.remoteAddress)
    delete user
        //add new client info
        let tbody_child = document.getElementById('table-body').childNodes
        tbody_child.forEach(element => {
          element.remove()
        })
        users_client.forEach(element => {
          let tr = document.createElement('tr')
          let td1 = document.createElement('td')
          let td2 = document.createElement('td')
          let td3 = document.createElement('td')
          td1.innerHTML = `${element.socket_address}`
          td2.innerHTML = `${element.username}`
          td3.innerHTML = `${element.room}`
          tr.appendChild(td1)
          tr.appendChild(td2)
          tr.appendChild(td3)
          document.getElementById('table-body').appendChild(tr)
        })
  })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dgram_server = dgramx.createServer('udp://localhost:3000')

dgram_server.on('listening', () => {
  const dgram_address = dgram_server.address();
  console.log(`UDP server listening ${dgram_address.address}:${dgram_address.port}`);

  dgram_server.on('user_info',(msg, rinfo) => {
    userJoin_client(rinfo.address,msg.username,msg.room)
    console.log(users_client)
    //dgram_server.to(rinfo.address, rinfo.port).emit('reply','received')
  })

  dgram_server.on('msg', (msg, rinfo) => {
    console.log(msg)
  })
})

dgram_server.on('close',(client) => {
  console.log('client disconencted')
  //const user = userLeaveroom_client(s)
})

dgram_server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  dgram_server.close();
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//server GUI
