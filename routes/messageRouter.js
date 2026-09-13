import express from "express";
import { sendMessage, deleteMessage, getMessage } from "../controller/messageController.js";
import authUserMiddleware from "../middleware/authUserMiddleware.js";

const messageRouter = express.Router();

messageRouter.use(authUserMiddleware);


// first message
messageRouter.post("/", sendMessage);

// send message in existing chat
messageRouter.post("/:chatId", sendMessage);

// fetch messages
messageRouter.get("/:messageId", getMessage);

// delete message
messageRouter.delete("/:messageId", deleteMessage);

export default messageRouter;