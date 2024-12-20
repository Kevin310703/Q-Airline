import express from "express";
import { contactMessageHandler } from "../controller/sendMessageController.js";

const router = express.Router();

router.post("/contact", contactMessageHandler);

export default router;
