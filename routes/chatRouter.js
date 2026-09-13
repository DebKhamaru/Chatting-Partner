import express from "express";
import authUserMiddleware from "../middleware/authUserMiddleware.js";
import { createChat, getSingleChat, getRecentChats, deleteChat } from "../controller/chatController.js";

const chatRouter = express.Router();

chatRouter.use(authUserMiddleware)

// create chat
chatRouter.post("/create", createChat);

//get last 20 chats 
chatRouter.get("/resent", getRecentChats);

//get single chat
chatRouter.get("/:chatId", getSingleChat);

// delete chat
chatRouter.delete("/:chatId", deleteChat);

export default chatRouter;