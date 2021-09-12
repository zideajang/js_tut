const socket = io("/");
console.log(ROOM_ID)
socket.emit('join-room', ROOM_ID,10)
console.log("hello")