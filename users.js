const users = [];

//adds the users in a array
function userJoin (id,username,room) {
    const user = {id,username,room};

    users.push(user);
    return user;
}
//retuns an array of all the users in a room
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}
// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
//user leaves
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}


module.exports = {
    userJoin,
    getRoomUsers,
    getCurrentUser,
    userLeave
}