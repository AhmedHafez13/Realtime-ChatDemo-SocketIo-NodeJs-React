const http = require("http");
const server = http.createServer();

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ----- * ----- * ----- */

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("✔️ a user connected");
  console.log(socket.id);

  onlineUsers[socket.id] = { id: socket.id, username: "" };


  socket.on("sign-in", (message) => {
    // console.log('sign-in: ', message);
    onlineUsers[socket.id].username = message.username;
    console.log("new user signed in:", {
      message,
      onlineUsers,
    });

    socket.broadcast.emit("new-user", {
      id: socket.id,
      username: message.username,
    });

    if (Object.values(onlineUsers).length > 1) {
      console.log("sending online users to the signed in user, id: ", socket.id);
      console.log("onlineUsers", Object.values(onlineUsers).filter(
        connect => connect.id !== socket.id && connect.username !== ""
      ));

      io.to(socket.id).emit("online-users", {
        onlineUsers: Object.values(onlineUsers).filter(
          connect => connect.id !== socket.id && connect.username !== ""
        ),
      });
    }
  });

  socket.on("message", (message) => {
    console.log("message: ", message);
    console.log("sending", {
      username: onlineUsers[socket.id].username,
      message: message,
      chatingWith: {
        id: message.chatingWith,
        username: onlineUsers[message.chatingWith.id].username,
      },
    });
    io.to(message.chatingWith.id).emit("new-message", {
      username: onlineUsers[socket.id].username,
      message: message,
      chatingWith: {
        id: socket.id,
        username: onlineUsers[socket.id].username,
      },
    });
    //socket.broadcast.emit('new-message', message);
  });

  socket.on("disconnect", () => {
    console.log("❌ user disconnected");
    delete onlineUsers[socket.id];

    socket.broadcast.emit("user-disconnected", { id: socket.id });
  });
});

server.listen(8080, () => {
  console.log("listening on http://localhost:8080");
});
