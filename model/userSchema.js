import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 30
        },

        age: {
            type: Number,
            min: 0,
            max: 120,
            default: 0
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        usage: {
            tokenUse: {
                type: Number,
                default: 0
            },

            resetAt: {
                type: Date,
                default: ()=> new Date(Date.now() + 5*60*60*1000)
            },

            totalTokenUses: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true 
    }
);

const User = mongoose.model("User",userSchema);

export default User;