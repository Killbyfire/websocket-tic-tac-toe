const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicFolder = "../public/";

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, publicFolder, "index.html"));
});

server.listen(3000);
