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
const rooms = {};

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

  // TODO send player state on join
  socket.on("joinRoom", (room, userID) => {
    let playerCount = io.sockets.adapter.rooms.get(room);

    if (!playerCount) {
      rooms[room] = {};
    }

    !playerCount ? (playerCount = 0) : (playerCount = playerCount.size);

    socket.join(room);

    let playerAssign = 0;

    if (playerCount === 1) {
      playerAssign = 1;
    }
    if (playerCount > 1) {
      playerAssign = -1;
    }

    if (typeof rooms[room][userID] === "number") {
      playerAssign = rooms[room][userID];
    } else {
      rooms[room][userID] = playerAssign;
    }

    console.log(rooms);

    socket.emit("playerAssign", playerAssign, userID);
  });

  // TODO Make spectator the player and reset game
  socket.on("leaveRoom", (room, userID) => {
    // ! This is buggy
    if (userID in rooms[room]) {
      const firstSpectator = Object.values(rooms[room]).findIndex(
        (role) => role === -1
      );

      // console.log("First spectator ", firstSpectator);

      if (firstSpectator != -1) {
        // ? Kinda messy
        const foundPlayer = Object.keys(rooms[room])[firstSpectator];

        rooms[room][foundPlayer] = rooms[room][userID];

        io.to(room).emit("playerAssign", rooms[room][foundPlayer], foundPlayer);
      }

      socket.leave(room);

      delete rooms[room][userID];

      // If room is empty
      if (!rooms[room]) {
        delete rooms[room];
      }

      console.log(rooms[room]);
    }
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

// Logic is handled in the javascript file.
app.get("/room/:roomID", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "room.html"));
});

server.listen(3000);
