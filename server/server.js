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
const port = 3000;

const rooms = {};

app.use(express.static(path.join(__dirname, publicFolder)));

io.on("connection", (socket) => {
  socket.on("sendGrid", (room, grid, turn) => {
    io.to(room).emit("updateGrid", grid, turn);
  });

  socket.on("joinRoom", (room, userID) => {
    let playerCount = io.sockets.adapter.rooms.get(room);

    if (!playerCount) {
      rooms[room] = {};
    }

    !playerCount ? (playerCount = 0) : (playerCount = playerCount.size);

    socket.join(room);

    let playerAssign = 0;

    playerAssign = Object.values(rooms[room])[0] === 0 ? 1 : 0;

    if (playerCount > 1) {
      playerAssign = -1;
    }

    // If user is already assigned
    if (typeof rooms[room][userID] === "number") {
      playerAssign = rooms[room][userID];
    } else {
      rooms[room][userID] = playerAssign;
    }

    if (playerCount >= 1) {
      const player = playerAssign === 0 ? 1 : 0;
      io.to(room).emit("sendGrid", player);
    }

    console.log(rooms);

    socket.emit("playerAssign", playerAssign, userID);
  });

  socket.on("leaveRoom", (room, userID) => {
    if (
      typeof rooms[room] !== "undefined" &&
      typeof rooms[room][userID] !== "undefined"
    ) {
      const firstSpectator = Object.values(rooms[room]).findIndex(
        (role) => role === -1
      );

      if (firstSpectator != -1) {
        // ? Kinda messy
        const foundPlayer = Object.keys(rooms[room])[firstSpectator];

        rooms[room][foundPlayer] = rooms[room][userID];

        io.to(room).emit("playerAssign", rooms[room][foundPlayer], foundPlayer);
        io.to(room).emit("newGame");
      }

      socket.leave(room);

      delete rooms[room][userID];

      // If room is empty
      if (!rooms[room]) {
        delete rooms[room];
      }
    }
  });

  socket.on("updateMove", (room, row, col) => {
    io.to(room).emit("updateMove", row, col);
  });

  socket.on("playerWon", (room) => {
    io.to(room).emit("playerWon");
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "index.html"));
});

// Logic is handled in the javascript file.
app.get("/room/:roomID", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "room.html"));
});

server.listen(port, () => {
  console.log("Listening on port", port)
});
