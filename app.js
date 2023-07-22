const express = require("express");
const multer = require("multer");
const authRouter = require("./routes/Auth");
const chatRouter = require("./routes/Chat");
const imageRouter = require("./routes/Image");
const authenticateUser = require("./middleware/authentication");
const cors = require("cors");
const http = require("http");
const app = express();
const imageModel = require("./models/Image");
const fs = require("fs");
const { Server } = require("socket.io");

require("dotenv").config();
require("express-async-errors");

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
/* app.use(bodyParser.urlencoded({ extended: false })); */

app.use("/auth", authRouter);
app.use("/user", authenticateUser, chatRouter);
app.use("/", imageRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const CHAT_BOT = "Chatbot";
let allUsers = [];
let chatRoomUsers = [];
const connectedUsers = new Map();

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("user_joined", (data) => {
    const { username } = data;
    connectedUsers.set(username, socket.id);
    console.log(connectedUsers);
  });

  socket.on("send_message", (data) => {
    const { sender, receiver, message, createdTime } = data;
    console.log("On send message", connectedUsers.get(receiver));
    const connectedId = connectedUsers.get(receiver);
    console.log("Sending to connected id", connectedId);
    if (connectedId) {
      io.to(connectedId).emit("receive_message", {
        sender,
        receiver,
        message,
        createdTime,
      });
    }
    socket.emit("receive_message", { sender, receiver, message, createdTime });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
    // Find and remove the disconnected user from the connectedUsers map
    for (const [username, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(username);
        console.log(`${username} disconnected.`);
        break; // Stop searching after the user is found and removed
      }
    }
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server is Spinning");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
