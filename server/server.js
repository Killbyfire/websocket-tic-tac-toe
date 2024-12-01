const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicFolder = "../public/";
const apiPath = "/api/v1/";

// Replace this with length of players in a room
const players = [];

app.use(express.static(path.join(__dirname, publicFolder)));

io.on("connection", (socket) => {
  // socket.on("userConnected", (userID) => {
  //   console.log("User connected with userID: " + userID);
  // });
  // socket.on("registerRoom", (roomDetails) => {
  //   console.log(
  //     "A new room has been created with the ID: " + roomDetails.roomID
  //   );
  //   currentRooms.push({
  //     roomID: roomDetails.roomID,
  //     players: [roomDetails.playerID],
  //   });
  // });

  // ! This also fires on reload. Use userID to check and based on rooms
  // TODO WIP
  socket.on("checkRoomExists", (room) => {
    const room = io.sockets.adapter.rooms.get(room);
  });

  socket.on("joinRoom", (room) => {
    let playerCount = io.sockets.adapter.rooms.get(room);

    !playerCount ? (playerCount = 0) : (playerCount = playerCount.size);

    socket.join(room);

    let playerAssign = 0;

    // ? This is buggy on reload
    if (playerCount === 1) {
      playerAssign = 1;
    }
    if (playerCount > 1) {
      playerAssign = -1;
    }

    socket.emit("playerAssign", playerAssign);
  });

  socket.on("updateMove", (row, col) => {
    io.emit("updateMove", row, col);
  });

  socket.on("playerWon", () => {
    io.emit("playerWon");
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "index.html"));
});

server.listen(3000);
