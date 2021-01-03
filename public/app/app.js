const form = document.querySelector(".form-mesage");
const output = document.querySelector(".output");
const rooms = document.querySelector(".room");
const usersList = document.querySelector(".b");
const currentUser = document.querySelector(".user");

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
currentUser.innerHTML = username;

const socket = io();

socket.emit('joinRoom',{username,room});

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
    console.log(room,users);
})

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
  
    // Scroll down
    output.scrollTop = output.scrollHeight;//scrolling to the bottom when the message is outputed
});

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let msg = e.target.elements.msg.value;

    socket.emit("message", msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage (message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = 
    `
    <span class="name">${message.username}</span>
    <span class="time">${message.time}</span>
    <p class="response">${message.text}</p>
    `;
    output.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    rooms.innerText = room;
};

// Add users to DOM
function outputUsers(users) {
    usersList.innerHTML = '';
    users.forEach(user=>{
      const p = document.createElement('p');
      p.innerText = user.username;
      usersList.appendChild(p);
    });
};