import express from "express";
import { signin, login, profile, logout } from "../controller/userController.js";
import authUserMiddleware from "../middleware/authUserMiddleware.js";

const userRouter = express.Router();

// sign in
userRouter.post("/signin", signin);

// log in 
userRouter.post("/login", login);

// fetching user profile
userRouter.get("/profile", authUserMiddleware, profile);

// log out
userRouter.post("/logout", logout);



export default userRouter;