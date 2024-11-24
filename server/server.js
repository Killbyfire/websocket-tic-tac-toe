const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

let currentRooms = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicFolder = "../public/";

app.use(express.static(path.join(__dirname, publicFolder)));

io.on("connection", (socket) => {
  socket.on("userConnected", (userID) => {
    console.log("User connected with userID: " + userID);
  });

  socket.on("registerRoom", (roomDetails) => {
    console.log(
      "A new room has been created with the ID: " + roomDetails.roomID
    );
    currentRooms.push({
      roomID: roomDetails.roomID,
      players: [roomDetails.userID],
    });
  });
});

app.get("/game/:gameID", function (req, res) {
  const gameID = req.params.gameID;

  res.sendFile(path.join(__dirname, publicFolder, "game.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "index.html"));
});

server.listen(3000);
