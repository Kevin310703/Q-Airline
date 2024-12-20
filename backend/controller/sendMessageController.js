import { sendContactMessage } from "../config/emailSender.js";

export const contactMessageHandler = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        await sendContactMessage(name, email, message);
        res.status(200).json({ message: "Your message has been sent successfully!" });
    } catch (error) {
        console.error("Error sending contact message:", error);
        res.status(500).json({ message: "An error occurred while sending your message." });
    }
};
