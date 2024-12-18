import express from "express";
import { getAllBookings, getBookingsByUser } from "../controller/bookingController.js";

const router = express.Router();

router.get("/booking-tickets", getAllBookings);
router.get("/booking-tickets/user/:user_id", getBookingsByUser);

export default router;
