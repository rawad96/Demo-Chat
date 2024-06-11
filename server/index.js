const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const connectUsersDB = require("./config/USERSDB");
const usersRouter = require("./routers/usersRouter");
const authRouter = require("./routers/authRouter");
const gropRouter = require("./routers/groupsRouter");
const access = require("./routers/accessRouter");
const usersBLL = require("./BLL/usersBLL");
const groupsBLL = require("./BLL/groupsBll");

const port = 3000;

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

connectUsersDB();

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
                    { msg: parsedMessage.message, typee: "s" },
                  ];
                }
              });
              userB.conversations.map((con) => {
                if (con.with === parsedMessage.from) {
                  con.conversation = [
                    ...con.conversation,
                    { msg: parsedMessage.message, typee: "r" },
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
                  conversation: [{ msg: parsedMessage.message, typee: "s" }],
                },
              ];
              userB.conversations = [
                ...userB.conversations,
                {
                  with: parsedMessage.from,
                  name: userA.name,
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
    } else if (parsedMessage.type === "group") {
      parsedMessage.to.map((user) => {
        const rec = clients.get(user._id);
        if (rec) {
          rec.send(parsedMessage.message);
        }
      });
      const setmessage = async () => {
        const group = await groupsBLL.getGroupById(parsedMessage.groupId);
        const resp = await groupsBLL.updateGroup(group._id, {
          conversation: [
            ...group.conversation,
            { msg: parsedMessage.message, from: parsedMessage.from },
          ],
        });
      };
      setmessage();
    }
  });

  ws.on("close", () => {
    console.log("disconnected");
  });
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://jobs4u-eef5.onrender.com"],
  })
);
app.use(express.json());

//Routers
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/groups", gropRouter);
app.use("/access", access);

server.listen(port);