import express from "express";

import { getChats } from "../controllers/chat.js"

const router = express.Router();

router.get('/get', getChats)

export default router