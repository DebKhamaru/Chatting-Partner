import dns from 'dns'; 
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from "express";
import 'dotenv/config'
import connectDB from './config/connectDatabase.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);

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