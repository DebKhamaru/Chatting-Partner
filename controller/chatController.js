import Chat from "../model/chatSchema.js";
import User from "../model/userSchema.js";
import Message from "../model/messageSchema.js";


export const createChat = async (req,res)=> {
    try{
        const { model } = req.body;

        if (!model) {
            return res.status(400).json({
                message: "Model is required"
            });
        }

        const chat = await Chat.create({
            userId: req.user._id,
            model,
            topic: "New Chat"
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat: {
                id: chat._id,
                topic: chat.topic,
                model: chat.model,
                createdAt: chat.createdAt
            }
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getSingleChat = async (req,res)=> {
    try{

        const { chatId } = req.params ;

        const chat = await Chat.findOne({userId:req.user._id, chatId:chatId});

        if(!chat) {
            return res.status(404).json({
                message: "chat not found"
            })
        }

        res.status(200).json({
            message: "Chat fetched successfully",
            chat
        });

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getRecentChats = async (req,res)=> {
    try{

        const chats = await Chat.find({userId: req.user._id})
        .select("topic model messageCount usage updatedAt createdAt")
        .sort({ updatedAt: -1 })
        .limit(20);

        res.status(200).json({
            message: "Recent chats fetched successfully",
            chats
        });

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteChat = async (req,res)=> {
    try{

        const { chatId } = req.params ;

        const chat = await Chat.findOne({userId: req.user._id, _id: chatId});

        if(!chat) {
            return res.status(404).json({
                message: "Chat not found"
            });
        }

        await Message.deleteMany({chatId: chat._id});
        await Chat.deleteOne({_id: chat._id});

        res.status(200).json({
            message: "Chat deleted successfully"
        });

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}