const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const connectUsersDB = require("./config/USERSDB");
const usersRouter = require("./routers/usersRouter");
const authRouter = require("./routers/authRouter");

const access = require("./routers/accessRouter");
const usersBLL = require("./BLL/usersBLL");

const path = require("path");
const mongoose = require("mongoose");

const port = 3000;

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

// connectUsersDB();

const clients = new Map();
const groups = new Map();

wsServer.on("connection", (ws) => {
  console.log("Recieved a new connection");

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "LOGIN") {
      clients.set(parsedMessage._id, ws);
    } else if (parsedMessage.type === "friend") {
      if (parsedMessage.isblocked === "NO") {
        const setmessage = async () => {
          const userA = await usersBLL.getUserById(parsedMessage.from);
          const userB = await usersBLL.getUserById(parsedMessage._id);
          const block = userB.blocked.find((b) => b === parsedMessage.from);

          if (!block) {
            const rec = clients.get(parsedMessage._id);
            if (rec) {
              rec.send(parsedMessage.message);
            }

            const co = userA.conversations.find(
              (c) => c.with === parsedMessage._id
            );
            if (co) {
              userA.conversations.map((con) => {
                if (con.with === parsedMessage._id) {
                  con.conversation = [
                    ...con.conversation,
                    {
                      msg: parsedMessage.message,
                      typee: "s",
                      forwarded: parsedMessage.forwarded ? true : false,
                    },
                  ];
                }
              });
              userB.conversations.map((con) => {
                if (con.with === parsedMessage.from) {
                  con.conversation = [
                    ...con.conversation,
                    {
                      msg: parsedMessage.message,
                      typee: "r",
                      forwarded: parsedMessage.forwarded ? true : false,
                    },
                  ];
                }
              });
              const resA = await usersBLL.updateUser(userA._id, userA);
              const resB = await usersBLL.updateUser(userB._id, userB);
            } else {
              userA.conversations = [
                ...userA.conversations,
                {
                  with: parsedMessage._id,
                  name: userB.name,
                  forwarded: parsedMessage.forwarded ? true : false,
                  conversation: [{ msg: parsedMessage.message, typee: "s" }],
                },
              ];
              userB.conversations = [
                ...userB.conversations,
                {
                  with: parsedMessage.from,
                  name: userA.name,
                  forwarded: parsedMessage.forwarded ? true : false,
                  conversation: [{ msg: parsedMessage.message, typee: "r" }],
                },
              ];
              const resA = await usersBLL.updateUser(userA._id, userA);
              const resB = await usersBLL.updateUser(userB._id, userB);
            }
          }
        };
        setmessage();
      }
    }
  });

  ws.on("close", () => {
    console.log("disconnected");
  });
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../myapp/dist")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//Routers
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/access", access);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.crzk4rq.mongodb.net/${process.env.DB_NAME}`
  )
  .then((result) => {
    server.listen(port), console.log("DB connected");
  });
