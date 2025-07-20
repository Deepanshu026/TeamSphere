const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); //since we are taking data from frontend we need to tell the backedn to accpet json data



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}`)
);

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.160.133:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("🔌 Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // ✅ Save it for later disconnection
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
      // Avoid sending to sender
      if (user._id.toString() === newMessageReceived.sender._id.toString())
        return;
      socket.to(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    socket.leave(socket.userId); // ✅ safely leave room
  });
});
