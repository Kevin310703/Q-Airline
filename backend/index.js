import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import roleRoutes from "./routes/roleRouters.js";
import airplaneRoutes from "./routes/airplaneRoutes.js";
import airportRoutes from "./routes/airportRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import searchRoutes from ".//routes/searchRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import sendMessageRoutes from "./routes/sendMessageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Địa chỉ frontend và admin
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api", roleRoutes);
app.use("/api", airplaneRoutes);
app.use("/api", airportRoutes);
app.use("/api", ticketRoutes);
app.use("/api", bookingRoutes);
app.use("/api", searchRoutes);
app.use("/api", announcementRoutes);
app.use("/api", promotionRoutes);
app.use("/api", destinationRoutes);
app.use("/api", sendMessageRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Running server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
