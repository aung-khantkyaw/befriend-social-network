import express from "express";
import expressWs from "express-ws";
import jwt from "jsonwebtoken";

const app = express();
expressWs(app);

const wsRouter = express.Router();
const secret = process.env.JWT_SECRET;

let clients = [];

wsRouter.ws("/webSocket", (ws, req) => {
  console.log("WS: Client connected");
  //   clients.push(ws);

  //   ws.on("message", (message) => {
  //     console.log("Received message:", message);
  //     // Broadcast the message to all clients
  //     clients.forEach((client) => {
  //       if (client !== ws) {
  //         client.send(message);
  //       }
  //     });
  //   });

  ws.on("message", (msg) => {
    const { token } = JSON.parse(msg);
    console.log("WS: token received");

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return false;
      }

      clients.push({ userId: user.id, ws });
      console.log(`WS: Client added: ${user.id}`);
    });
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});

export { wsRouter, clients };
