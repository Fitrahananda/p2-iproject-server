if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./router/index");
const error = require("./middleware/errorHandler");
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket.on("customEventFormClient", (payload) => {
    io.emit("terima payload", payload);
  });

  socket.emit("customEventFormClient", "kemabaliannya server");
});

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use(error);
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
