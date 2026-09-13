# Chatting Partner — Backend

A backend API for an AI-powered chatting application built with **Node.js, Express.js, MongoDB, and Google Gemini AI**.

The application supports user authentication, chat management, message storage, conversation history, AI-generated responses, and token usage tracking.

---

## 🚀 Features

* User registration and login
* Secure password hashing with bcrypt
* JWT-based authentication
* Authentication using HTTP cookies
* User logout
* Delete user account
* Zod request validation
* MongoDB database with Mongoose
* Create and manage chats
* Store user and AI messages
* Conversation history
* Conversation summaries
* Google Gemini AI integration
* AI-generated chat responses
* Token usage tracking
* Protected API routes
* Centralized error handling
* Environment variable configuration

---

## 🛠️ Technologies Used

| Technology       | Purpose               |
| ---------------- | --------------------- |
| Node.js          | JavaScript runtime    |
| Express.js       | Backend framework     |
| MongoDB          | Database              |
| Mongoose         | MongoDB ODM           |
| Google Gemini AI | AI responses          |
| JWT              | Authentication        |
| bcrypt           | Password hashing      |
| Zod              | Data validation       |
| dotenv           | Environment variables |
| Postman          | API testing           |

---

## 📁 Project Structure

```text
backEnd/
│
├── config/
│   └── databaseConnection.js
│
├── controller/
│   ├── authController.js
│   ├── chatController.js
│   ├── messageController.js
│   └── userController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── model/
│   ├── User.js
│   ├── Chat.js
│   └── Message.js
│
├── routes/
│   ├── authRouter.js
│   ├── chatRouter.js
│   ├── messageRouter.js
│   └── userRouter.js
│
├── services/
│   └── aiService.js
│
├── validators/
│   └── userValidator.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

> Your actual folder names can be different. The structure above is an example of how the project can be organized.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

Go into the project directory:

```bash
cd backEnd
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT_NUMBER=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

### Environment Variables

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `PORT_NUMBER`    | Port on which the server runs      |
| `MONGODB_URI`    | MongoDB connection string          |
| `JWT_SECRET`     | Secret key used to sign JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key              |

**Never commit your `.env` file to GitHub.**

Add this to `.gitignore`:

```gitignore
node_modules/
.env
```

---

# ▶️ Running the Project

Start the server normally:

```bash
node index.js
```

If you are using Nodemon:

```bash
npm run dev
```

Example `package.json` scripts:

```json
{
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    }
}
```

The server should start at:

```text
http://localhost:5000
```

---

# 🔐 Authentication

The application uses **JWT authentication**.

Typical authentication flow:

```text
Register
   ↓
Login
   ↓
JWT Token
   ↓
Authentication Middleware
   ↓
Protected Routes
```

Passwords are hashed using `bcrypt` before being stored in the database.

---

# 👤 User APIs

## Register User

```http
POST /api/auth/register
```

Example request:

```json
{
    "username": "deb",
    "email": "deb@example.com",
    "password": "your-password"
}
```

---

## Login User

```http
POST /api/auth/login
```

Example:

```json
{
    "email": "deb@example.com",
    "password": "your-password"
}
```

---

## Logout

```http
POST /api/auth/logout
```

This removes/invalidates the authentication cookie according to the application's authentication implementation.

---

## Delete Account

```http
DELETE /api/user/delete
```

This is a protected route and requires authentication.

---

# 💬 Chat APIs

Chats represent individual conversations between the user and the AI.

A chat can contain:

* Chat title
* User
* Messages
* Conversation summary
* Created/updated timestamps

Example:

```text
User
 │
 ├── Chat 1
 │    ├── Message
 │    ├── Message
 │    └── Message
 │
 └── Chat 2
      ├── Message
      └── Message
```

---

# 📨 Message API

Send a message to a specific chat:

```http
POST /api/messages/:chatId
```

For example:

```text
POST http://localhost:5000/api/messages/68c5f2a91e123456789abcd
```

Request body:

```json
{
    "content": "Explain JavaScript closures"
}
```

The backend:

```text
Receive message
      ↓
Validate request
      ↓
Find chat
      ↓
Get conversation history
      ↓
Build AI context
      ↓
Send request to Gemini
      ↓
Receive AI response
      ↓
Save AI message
      ↓
Return response
```

---

# 🤖 Gemini AI Integration

The project uses **Google Gemini** to generate AI responses.

The backend prepares:

### System instructions

```text
SYSTEM_PROMPT
```

### Conversation summary

```text
Previous conversation summary
```

### Previous messages

```text
User message
AI response
User message
AI response
```

### Current message

```text
Current user question
```

These are then sent to Gemini.

Conceptually:

```text
System Instruction
       +
Conversation Summary
       +
Previous Messages
       +
Current Message
       ↓
   Gemini AI
       ↓
   AI Response
```

---

# 🧠 Conversation History

The backend maintains conversation context so the AI can understand previous messages.

Messages are converted into Gemini's conversation format.

User messages:

```js
{
    type: "user_input",
    content: [
        {
            type: "text",
            text: "Hello"
        }
    ]
}
```

AI messages:

```js
{
    type: "model_output",
    content: [
        {
            type: "text",
            text: "Hello! How can I help you?"
        }
    ]
}
```

The system instructions are passed separately:

```js
system_instruction: systemInstruction
```

---

# 📊 Token Usage

The backend also stores AI token usage with each assistant message.

Example:

```js
usage: {
    promptTokens: usage?.promptTokenCount || 0,
    completionTokens: usage?.candidatesTokenCount || 0,
    totalTokens: usage?.totalTokenCount || 0
}
```

This makes it possible to track how many tokens are being used by the application.

---

# 🗄️ Database

The application uses **MongoDB** with **Mongoose**.

Main collections/models:

```text
User
Chat
Message
```

Relationship:

```text
User
 │
 └── Chat
      │
      └── Messages
```

A message belongs to a chat through:

```js
chatId
```

---

# ✅ Validation

The project uses **Zod** to validate incoming data.

Example:

```js
const userSchema = z.object({
    username: z.string().trim().min(3),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6)
});
```

Validation helps prevent invalid data from entering the application.

---

# 🧪 Testing

The API can be tested using **Postman**.

Example:

```text
POST
http://localhost:5000/api/messages/<chatId>
```

Body:

```json
{
    "content": "What is Node.js?"
}
```

Make sure the request contains the required authentication credentials if the route is protected.

---

# 🔒 Security

The project includes several security mechanisms:

* Password hashing with bcrypt
* JWT authentication
* HTTP-only authentication cookies
* Protected routes
* Request validation with Zod
* Environment variables for secrets
* MongoDB authentication
* Input validation

### Important

Do not expose these values publicly:

```text
GEMINI_API_KEY
JWT_SECRET
MONGODB_URI
```

---

# 🌱 Future Improvements

Possible future improvements include:

* Streaming AI responses
* Typing indicator
* Message pagination
* Better conversation summarization
* Chat search
* Chat deletion
* Rename chat
* Regenerate AI response
* Edit messages
* Rate limiting
* Refresh token system
* API documentation with Swagger
* Unit and integration testing
* Docker support
* Production deployment
* Redis caching
* WebSocket/Socket.IO real-time communication

---

# 📌 API Flow

Overall application architecture:

```text
                 Client
                   │
                   ▼
              Express API
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
   Authentication        Chat API
          │                 │
          │                 ▼
          │             Message API
          │                 │
          │                 ▼
          │             AI Service
          │                 │
          │                 ▼
          │          Google Gemini
          │                 │
          │                 ▼
          └──────────► MongoDB
```

---

# 👨‍💻 Author

**Deb Khamaru**

MCA Student | MERN Stack Developer

GitHub: `https://github.com/DebKhamaru`

LinkedIn: `https://linkedin.com/in/deb-khamaru-468b04396`

---

# 📄 License

This project is currently intended for learning and development purposes.

```

This README is suitable for putting directly into your backend repository as **`README.md`**.
```