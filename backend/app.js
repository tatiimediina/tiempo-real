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
const io = new Server(server,  {
  cors: {
    origin : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }})

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
let listMessages = []
// EVENTO
io.on("connection", (socket) => {
  console.log("cliente conectado", socket.id);
  socket.emit('get-messages', listMessages)

  socket.on("chat-message", (data) => {
    io.emit("chat-message", data);
  });

  socket.on('new-message', (newMessage)=>{
    listMessages.push(newMessage)
    io.emit('new-message', listMessages)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
