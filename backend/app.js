import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";

// CONFIG
const app = express();
const PORT = 4000;
const server = createServer(app);

// INTEGRACIÓN CON SOCKET.IO
const io = new Server(server);

// MIDDLEWARES
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// RUTAS
app.get("/", (req, res) => {
  res.send("server is running");
});

// EVENTO
io.on("connection", (socket) => {
  console.log("cliente conectado", socket.id);

  socket.on("chat-message", (data) => {
    io.emit("chat-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
