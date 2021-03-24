const users_client = []

function userJoin_client(socket_address,username,room,Socket){
    const user = {socket_address,username, room,Socket}
    users_client.push(user)

    return(user)
}

function getCurrentUser_client(socket_address) {
    return users_client.find(user => user.socket_address === socket_address)
}

function getAlluserInroom_client(room) {
    let index = users_client.filter(user => user.room === room)
    return index
}

function userLeaveroom_client(socket_address){
    const index = users_client.findIndex(user => user.socket_address === socket_address)

    if(index !== -1) {
        return users_client.splice(index,1)[0]
    }
}
module.exports = {
    getCurrentUser_client,
    userJoin_client,
    userLeaveroom_client,
    getAlluserInroom_client,
    users_client
}