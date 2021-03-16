var users = []
function getUsers(users_list){
    onlineUsers = []
    for(var user of users_list){
        onlineUsers.push(Object.values(user)[0])
    }
    return onlineUsers
}
module.exports = {users, getUsers}
