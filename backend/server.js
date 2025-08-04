const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
// CORS configuration for local + deployed frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://team-sphere.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json()); // Accept JSON from frontend

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}`));

//Socket.IO setup with CORS
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://team-sphere.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id;
    socket.emit("connected");
    console.log(`${userData._id} joined their own room`);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id.toString() === newMessageReceived.sender._id.toString())
        return;
      socket.to(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    socket.leave(socket.userId);
  });
});
