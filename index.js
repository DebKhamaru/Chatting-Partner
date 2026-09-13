import dns from 'dns'; 
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from "express";
import 'dotenv/config'
import connectDB from './config/connectDatabase.js';
import userRouter from './routes/userRouter.js';
import cookieParser from 'cookie-parser';
import chatRouter from "./routes/chatRouter.js"
import messageRouter from './routes/messageRouter.js';


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);


const startServer = async ()=> {
    try {
        await connectDB();
        app.listen(process.env.PORT_NUMBER, ()=> {
            console.log(`The server is listening at port number ${process.env.PORT_NUMBER}`);
        })
    }
    catch(err) {
        console.log(err);
    }
}

startServer();