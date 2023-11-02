// import { io } from "../app";
// const userSockets = {}; // Map of user IDs to socket connections
// const chatSocket = io('/chat');


// io.on('connection', (socket:any) => {
//   const userId = getUserIdFromSocket(socket);
//   console.log("this is user",userId)
//   if (userId) {
//     userSockets[userId] = socket;
//   }

//   socket.on('disconnect', () => {
//     // Remove the socket from the map when a user disconnects
//     delete userSockets[userId];
//   });

//   // ... other socket event handlers ...
// });

// function getUserIdFromSocket(socket) {
//   // Assuming you send the user ID as a query parameter during the socket connection
//   const userId = socket.handshake.query.userId;

//   return userId || null; // Return the user ID if found, or null if not available
// }

// module.exports = { userSockets };
