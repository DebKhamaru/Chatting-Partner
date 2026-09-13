import Message from "../model/messageSchema.js";
import Chat from "../model/chatSchema.js";
import { generateAIResponse } from "../services/openRouterService.js";
import messageRouter from "../routes/messageRouter.js";



const SYSTEM_PROMPT = `You are a helpful coding teacher.
    Explain concepts in simple language.
    Do not overcomplicate.
    Use examples when needed.`;

const SUMMARY_CHUNK_SIZE = 20;

// const buildMessagesForAI = ({ chat, recentMessages, currentMessage }) => {
//     const messages = [
//         {
//           role: "system",
//           content: SYSTEM_PROMPT,
//         },
//     ];

//     if (chat.summary && chat.summary.trim() !== "") {
//         messages.push({
//             role: "system",
//             content: `Previous conversation summary: ${chat.summary}`,
//         });
//     }

//     for (const msg of recentMessages) {
//         messages.push({
//             role: msg.role,
//             content: msg.content,
//         });
//     }

//     messages.push({
//         role: "user",
//         content: currentMessage,
//     });

//     return messages;
// };


const buildMessagesForAI = ({ chat, recentMessages, currentMessage }) => {
    // Combine system prompt and conversation summary
    let systemInstruction = SYSTEM_PROMPT;

    if (chat.summary && chat.summary.trim() !== "") {
        systemInstruction += `\n\nPrevious conversation summary:\n${chat.summary}`;
    }

    // Build Gemini conversation history
    const history = [];

    for (const msg of recentMessages) {
        if (msg.role === "user") {
            history.push({
                type: "user_input",
                content: [
                    {
                        type: "text",
                        text: msg.content,
                    },
                ],
            });
        }

        if (msg.role === "assistant") {
            history.push({
                type: "model_output",
                content: [
                    {
                        type: "text",
                        text: msg.content,
                    },
                ],
            });
        }
    }

    // Add current user message
    history.push({
        type: "user_input",
        content: [
            {
                type: "text",
                text: currentMessage,
            },
        ],
    });

    return {
        systemInstruction,
        history,
    };
};

const updateSummaryIfNeeded = async (chat) => {
    const unsummarizedCount = chat.messageCount - chat.summarizedTillMessageNumber;

    if (unsummarizedCount < SUMMARY_CHUNK_SIZE) {
        return chat;
    }

    const messagesToSummarize = await Message.find({
        chatId: chat._id,
    })
    .sort({ createdAt: 1 })
    .skip(chat.summarizedTillMessageCount)
    .limit(SUMMARY_CHUNK_SIZE);

    if (messagesToSummarize.length === 0) {
        return chat;
    }

    const summaryPrompt = [
        {
            role: "system",
            content: `You are summarizing a chat conversation.
            Create a concise summary that preserves:
            1. user's goal
            2. important facts
            3. decisions already made
            4. code/design choices
            5. unresolved doubts

            Do not add new information.`,
        },
        {
            role: "user",
            content: `Existing summary:
            ${chat.summary || "No previous summary."}

            New messages to add into summary:
            ${messagesToSummarize
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n")}`,
        },
    ];

    const { aiReply } = await generateAIResponse({ messages: summaryPrompt });

    chat.summary = aiReply;
    chat.summaryUpdatedAt = new Date();
    chat.summarizedTillMessageCount += messagesToSummarize.length;

    await chat.save();

    return chat;
};

export const sendMessage = async (req,res)=> {
    try {

        const { chatId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "Message content is required",
            });
        }

        let chat;
        // Existing chat
        if (chatId) {
            chat = await Chat.findOne({
                _id: chatId,
                userId: req.user._id,
            });

            if (!chat) {
                return res.status(404).json({
                  message: "Chat not found",
                });
            }
        }
        else {
            chat = await Chat.create({
                userId: req.user._id,
                topic: content.trim().slice(0, 40),
            });
            if(!chat) {
                return res.status(500).json({
                    message:"chat creation failed"
                })
            }
        }   

        // 1. Update summary if old messages crossed 20
        chat = await updateSummaryIfNeeded(chat);

        // 2. Fetch messages that are NOT summarized yet
        const recentMessages = await Message.find({
            chatId: chat._id,
        })
        .sort({ createdAt: 1 })
        .skip(chat.summarizedTillMessageCount);

        // 3. Build AI context
        const { systemInstruction, history } = buildMessagesForAI({
            chat,
            recentMessages,
            currentMessage: content.trim(),
        });

        // 4. Call OpenRouter
        const { aiReply, usage } = await generateAIResponse({ systemInstruction, history });

        // 5. Save user message
        const userMessage = await Message.create({
            userId:req.user._id,
            chatId: chat._id,
            role: "user",
            content: content.trim(),
        });

        // 6. Save assistant message
        const assistantMessage = await Message.create({
            userId:req.user._id,
            chatId: chat._id,
            role: "assistant",
            content: aiReply,

            usage: {
                promptTokens: usage.promptTokenCount || 0,
                completionTokens: usage.candidatesTokenCount || 0,
                totalTokens: usage.totalTokenCount || 0,
            },
        });

        const promptTokens = usage.promptTokenCount || 0;
        const completionTokens = usage.candidatesTokenCount || 0;
        const totalTokens = usage.totalTokenCount || 0;

        // 8. Update user usage
        req.user.usage.tokenUsed += totalTokens;
        req.user.usage.totalTokenUsed += totalTokens;

        await req.user.save();

        res.status(201).json({
            message: "Message sent successfully",
            chatId: chat._id,
            reply: aiReply,
            usage: {
              promptTokens,
              completionTokens,
              totalTokens,
            },
            userMessage,
            assistantMessage,
        });

    }

    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getMessage = async (req,res)=> {
    try {

        const { messageId } = req.params ;

        const message = await Message.findOne({ userId:req.user._id, _id:messageId});

        if(!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        res.status(200).json({
            message:message
        })

    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteMessage = async (req,res)=> {
    try {

        const { messageId } = req.params ;

        const message = await Message.findOne({ userId: req.user._id, _id:messageId});

        if(!message) {
            return res.status(404).json({
                message: "message not found"
            })
        }

        await Message.deleteOne({_id:messageId});

        res.status(201).json({
            message: "Message deleted successfully",
        });

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}