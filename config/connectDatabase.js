import mongoose from "mongoose";

const connectDB = async ()=> {
    await mongoose.connect(process.env.MONGOOSE_DB);
    console.log("Database connected successfully");
}

export default connectDB;