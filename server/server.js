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
      players: [roomDetails.playerID],
    });
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "index.html"));
});

server.listen(3000);
