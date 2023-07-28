import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import userRoutes from './routes/user.js'
import chatRoutes from './routes/chats.js'

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Spam-Jam.");
});

app.use('/user', userRoutes);
app.use('/chat',chatRoutes)

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}.`);
});
